const express = require('express');
const bodyParser = require('body-parser');
const WhatsAppCloudAPI = require('./cloud_api_client');
const { hospitals } = require('./hospitals');
const { setupDatabase } = require('./database');
const SessionManager = require('./sessionManager');
const supabase = require('./supabase_client');

const app = express();
app.use(bodyParser.json());

const PORT = 3002; // Use a different port if needed
let dynamicDepartments = {};

async function init() {
    const db = await setupDatabase();
    sessionManager = new SessionManager(db);
    cloudAPI = new WhatsAppCloudAPI(config.cloudApiAccessToken, config.cloudPhoneNumberId);
    
    console.log("Fetching live hospital data for Cloud API...");
    dynamicDepartments = await supabase.getBotData() || config.fallbackDepartments;
    console.log(`Loaded ${Object.keys(dynamicDepartments).length} departments.`);
}

// 1. DEPARTMENT LIST (Dynamic)
const getDeptMenu = (phone) => {
    const rows = Object.entries(dynamicDepartments).map(([id, dept]) => ({
        id: `dept_${id}`,
        title: dept.name.toUpperCase().slice(0, 24) // WhatsApp limit
    }));

    return cloudAPI.sendList(
        phone,
        "Select Department 🏥",
        "Please select a department for your appointment",
        "Select Dept",
        [{
            title: "Hospital Departments",
            rows: rows
        }]
    );
};

// 2. DOCTOR LIST (Dynamic)
const getDoctorMenu = (phone, deptKey) => {
    const dept = dynamicDepartments[deptKey];
    if (!dept) return cloudAPI.sendText(phone, "❌ Department not found.");

    const doctorRows = dept.doctors.map((doc, index) => ({
        id: `dr_${doc.id}`,
        title: doc.name.toUpperCase().slice(0, 24),
        description: "Specialist"
    }));

    if (doctorRows.length === 0) {
        return cloudAPI.sendText(phone, `Currently no doctors listed for ${dept.name}.`);
    }

    return cloudAPI.sendList(
        phone,
        "👨‍⚕️ Select Doctor",
        `Available specialists in ${dept.name}`,
        "Select Doctor",
        [{
            title: "Available Doctors",
            rows: doctorRows
        }]
    );
};

// 3. SLOT LIST
const getSlotMenu = (phone) => {
    return cloudAPI.sendList(
        phone,
        "⏰ Select Time",
        "Choose a convenient time slot",
        "Book Slot",
        [{
            title: "Available Slots",
            rows: [
                { id: "slot_10am", title: "10:00 AM", description: "Morning" },
                { id: "slot_11am", title: "11:00 AM", description: "Morning" },
                { id: "slot_02pm", title: "02:00 PM", description: "Afternoon" }
            ]
        }]
    );
};

// WEBHOOK HANDLER
app.post('/webhook', async (req, res) => {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const phone = message.from;
    let session = await sessionManager.getSession(phone);
    if (!session) {
        session = await sessionManager.createSession(phone);
    }
    const data = session.data;
    data.phone = phone;

    try {
        // HANDLE LIST SELECTION
        if (message.type === 'interactive' && message.interactive.type === 'list_reply') {
            const selectionId = message.interactive.list_reply.id;
            const selectionTitle = message.interactive.list_reply.title;

            switch (session.state) {
                case 'SELECT_DEPT':
                    const deptKey = selectionId.replace('dept_', '');
                    data.department = selectionTitle;
                    data.deptKey = deptKey;
                    await sessionManager.updateSession(phone, 'SELECT_DOCTOR', data);
                    await getDoctorMenu(phone, deptKey);
                    break;

                case 'SELECT_DOCTOR':
                    data.doctor = selectionTitle;
                    await sessionManager.updateSession(phone, 'SELECT_SLOT', data);
                    await getSlotMenu(phone);
                    break;

                case 'SELECT_SLOT':
                    data.time = selectionTitle;
                    data.date = new Date().toISOString().split('T')[0];
                    const aptId = await sessionManager.saveNormalAppointment(data);
                    
                    await cloudAPI.sendText(phone, `✅ *BOOKING CONFIRMED!*\n\nHospital: Balaji Hospital 🏥\nID: *${aptId}*\nDoctor: ${data.doctor}\nDate: ${data.date}\nTime: ${data.time}\n\nManage your booking at: https://hospital-balaji.vercel.app/appointment\n\nThank you for choosing us!`);
                    
                    // Notify Admin/Doctor (Fallback to config.adminPhone)
                    await cloudAPI.sendText(config.adminPhone.split('@')[0], `NEW APPOINTMENT\n\nPatient: ${phone}\nID: ${aptId}\nTime: ${data.time}`);

                    await sessionManager.deleteSession(phone);
                    break;
            }
        } 
        
        // HANDLE TEXT INPUT
        else if (message.type === 'text') {
            const body = message.text.body.trim().toLowerCase();

            if (body === 'hi' || body === 'start' || session.state === 'START') {
                await sessionManager.updateSession(phone, 'SELECT_DEPT', data);
                await getDeptMenu(phone);
            } else {
                await cloudAPI.sendText(phone, "⚠️ Please select an option from the menu above or type 'HI' to restart.");
            }
        }
    } catch (err) {
        console.error("Webhook Logic Error:", err);
    }

    res.sendStatus(200);
});

// Verification Endpoint for Meta
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === config.webhookVerifyToken) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

init().then(() => {
    app.listen(PORT, () => console.log(`Cloud API Webhook running on port ${PORT}`));
});
