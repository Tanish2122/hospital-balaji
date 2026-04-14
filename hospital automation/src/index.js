const http = require('http');
const https = require('https');
const ngrok = require('@ngrok/ngrok');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const { setupDatabase } = require('./database');
const SessionManager = require('./sessionManager');
const config = require('./config');
const supabase = require('./supabase_client');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const API_PORT = process.env.PORT || 3001;

// Global Error Handlers to debug silent crashes
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

async function startBot() {
    console.log("Fetching live hospital data from website...");
    const dynamicDepartments = await supabase.getBotData() || config.fallbackDepartments;
    console.log(`Loaded ${Object.keys(dynamicDepartments).length} departments from Balaji Hospital.`);

    const db = await setupDatabase();
    const sessionManager = new SessionManager(db);


    let botReady = false;
    let lastQr = null;
    let qrTime = null;



    const client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            protocolTimeout: 120000, // 2 minutes
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu',
                // '--single-process', // Removed: causes stability issues on local machines
                '--disable-extensions',
                '--disable-features=IsolateOrigins,site-per-process', 
                '--js-flags="--max-old-space-size=256"', // Increased for local
                '--disable-background-networking',
                '--disable-sync',
                '--disable-default-apps',
                '--mute-audio',
                '--no-default-browser-check',
                '--no-pings',
                '--disable-translate',
                '--disable-notifications',
                '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
            ],
            headless: 'new'
        }
    });

    // --- START SERVER IMMEDIATELY (For Render) ---
    const server = http.createServer(async (req, res) => {
        // CORS Headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }

        // 1. PUBLIC STATUS PAGES (Visible even if not logged in)
        if (req.method === 'GET' && req.url === '/') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
                <html>
                    <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                        <h1>Balaji Hospital Bot Status</h1>
                        <p>Status: <b>${botReady ? "<span style='color:green;'>✅ READY</span>" : "<span style='color:orange;'>⏳ WAITING FOR QR</span>"}</b></p>
                        ${qrTime ? `<p><small>Last QR received: ${qrTime}</small></p>` : ""}
                        ${!botReady && lastQr ? `
                            <p><a href="/qr" style="background: blue; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">SCAN QR CODE HERE</a></p>
                            <p><i>If scan doesn't work, wait 10s and refresh this page.</i></p>
                        ` : ""}
                        ${botReady ? "<p style='color: green;'>Bot is connected! You can close this page.</p>" : ""}
                    </body>
                </html>
            `);
            return;
        }

        if (req.method === 'GET' && req.url === '/qr') {
            if (lastQr) {
                res.writeHead(302, { 'Location': `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(lastQr)}` });
                res.end();
            } else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end("QR code is not generated yet. Please wait for the browser to start.");
            }
            return;
        }

        // 2. API ENDPOINTS (Require Bot Ready)
        if (!botReady) {
            res.writeHead(503, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: "Bot still initializing. Scan QR first." }));
            return;
        }

        if (req.method === 'POST' && req.url === '/send-message') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', async () => {
                try {
                    const { to, message, media } = JSON.parse(body);
                    let cleanNumber = to.replace(/\D/g, '');
                    if (cleanNumber.length === 10) cleanNumber = `91${cleanNumber}`;
                    if (!cleanNumber.endsWith('@c.us')) cleanNumber = `${cleanNumber}@c.us`;
                    
                    console.log(`[API] Sending message to ${cleanNumber}...`);

                    if (media && media.startsWith('http')) {
                        try {
                            const mediaObj = await MessageMedia.fromUrl(media);
                            await client.sendMessage(cleanNumber, mediaObj, { caption: message });
                        } catch (e) {
                            await client.sendMessage(cleanNumber, message);
                        }
                    } else {
                        await client.sendMessage(cleanNumber, message);
                    }

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } catch (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: err.message }));
                }
            });
            return;
        }

        // Fallback
        res.writeHead(404);
        res.end();
    });

    server.listen(API_PORT, async () => {
        console.log(`\n✅ HTTP Server Listening on Port ${API_PORT}`);
        
        if (config.ngrokToken) {
            try {
                const listener = await ngrok.connect({ addr: API_PORT, authtoken: config.ngrokToken.trim() });
                console.log(`🚀 PUBLIC API URL: ${listener.url()}`);
                console.log(`👉 Status Page: ${listener.url()}/ (Check here if QR is missing)`);
                console.log(`\n⚠️  IMPORTANT: COPY the PUBLIC API URL above and update your Vercel/Website settings!`);
            } catch (err) { 
                console.error('Ngrok Error:', err.message);
                console.log('Running locally on http://localhost:' + API_PORT);
            }
        } else {
            console.log('Running locally on http://localhost:' + API_PORT);
            console.log('Note: To connect to your website, you MUST provide an ngrokToken in config.js');
        }
    });

    console.log('Initializing WhatsApp client...');

    client.on('qr', (qr) => {
        lastQr = qr;
        qrTime = new Date().toLocaleTimeString();
        console.log(`\n📢 [${qrTime}] NEW QR RECEIVED. Scan now!`);
        console.log(`👉 Link: https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qr)}`);
        qrcode.generate(qr, { small: true });
    });

    client.on('authenticated', () => {
        console.log('✅ WhatsApp Authenticated!');
    });

    client.on('auth_failure', (msg) => {
        console.error('⚠️ AUTHENTICATION FAILURE:', msg);
        qrTime = null; // Clear old QR status
    });

    client.on('ready', async () => {
        console.log('🚀 ✅ Advanced Hospital Bot is ready!');
        botReady = true;
    });

    client.on('message', async (msg) => {
        if (msg.from === 'status@broadcast') return; // Ignore status updates

        const phone = msg.from;
        let session = await sessionManager.getSession(phone);

        // Handle Reset/Start
        if (!session || msg.body.toLowerCase() === 'reset' || msg.body.toLowerCase() === 'hi') {
            session = await sessionManager.createSession(phone);
            await sendMainMenu(client, phone);
            return;
        }

        await handleConversationalFlow(client, phone, msg, session, sessionManager, dynamicDepartments);
    });

    client.initialize();
}

async function sendMainMenu(client, phone) {
    const menu = `Welcome to *${config.hospitalName}*! 🏥\n\nPlease choose an option:\n1️⃣ *Emergency 🚨*\n2️⃣ *Book Appointment 🏥*\n\nWebsite: https://hospital-balaji.vercel.app/appointment`;
    await client.sendMessage(phone, menu).catch(err => console.error("Send Error:", err));
}

async function handleConversationalFlow(client, phone, msg, session, sessionManager, departments) {
    const text = msg.body.trim();
    const data = session.data;
    data.phone = phone;

    switch (session.state) {
        case 'START':
            if (text === '1') {
                await sessionManager.updateSession(phone, 'EMG_NAME', data);
                await client.sendMessage(phone, "🚨 *Emergency Mode Activated*\nPlease enter the *Patient Name*.");
            } else if (text === '2') {
                await sessionManager.updateSession(phone, 'NORMAL_DEPT', data);
                let deptMsg = "🏥 *Appointment Booking*\nPlease choose a department:\n";
                for (const [id, dept] of Object.entries(departments)) {
                    deptMsg += `${id}️⃣ ${dept.name}\n`;
                }
                await client.sendMessage(phone, deptMsg).catch(err => console.error("Send Error:", err));
            } else {
                await client.sendMessage(phone, "❌ Invalid option. Please reply with 1 or 2.");
            }
            break;

        // --- EMERGENCY FLOW ---
        case 'EMG_NAME':
            data.name = text;
            await sessionManager.updateSession(phone, 'EMG_REPORTS', data);
            await client.sendMessage(phone, `Thank you, ${data.name}. 📄 Please *upload/send* any medical reports (X-ray, MRI, images). When done, reply with *DONE*.`);
            break;

        case 'EMG_REPORTS':
            if (text.toLowerCase() === 'done') {
                const emgId = await sessionManager.saveEmergencyRequest(data);
                await client.sendMessage(phone, `✅ Your emergency request has been sent (ID: *${emgId}*). Our duty doctor will contact you immediately.`);

                // 2. Trigger Unified 4-Way Notification via Website
                try {
                    const cleanPatientPhone = phone.replace(/\D/g, '');
                    await axios.post(`${config.websiteUrl}/api/notify`, {
                        type: 'emergency',
                        data: {
                            patient: { name: data.name, phone: `${cleanPatientPhone}@c.us` },
                            id: emgId,
                            doctor: { name: config.emergencyDoctor.name, phone: config.emergencyDoctor.phone },
                            reportUrl: data.reports && data.reports.length > 0 ? data.reports[0].url : null,
                            adminPhone: config.adminPhone,
                            recepPhone: config.receptionistPhone
                        }
                    }, { timeout: 10000 });
                } catch (notifyErr) {
                    console.error("Website Notification Failed:", notifyErr.message);
                }

                await sessionManager.deleteSession(phone);
            } else if (msg.hasMedia) {
                const media = await msg.downloadMedia();
                const filename = `report_${Date.now()}.${media.mimetype.split('/')[1]}`;
                const filePath = path.join(__dirname, '../uploads', filename);
                fs.writeFileSync(filePath, media.data, { encoding: 'base64' });
                data.reports.push(filePath);
                await sessionManager.updateSession(phone, 'EMG_REPORTS', data);
                await client.sendMessage(phone, "✅ File received. You can send more files or reply *DONE* to finish.");
            } else {
                await client.sendMessage(phone, "⚠️ Please send a medical report file or reply *DONE*.");
            }
            break;

        // --- NORMAL FLOW ---
        case 'NORMAL_DEPT':
            if (departments[text]) {
                data.deptId = text;
                data.department = departments[text].name;
                let docMsg = `Choosing ${data.department}. Please choose a doctor:\n`;

                const doctors = departments[text].doctors;
                if (doctors.length === 0) {
                    docMsg = `Currently no specialized doctors are listed for ${data.department} on our website. Please contact support.`;
                    await client.sendMessage(phone, docMsg);
                    await sessionManager.deleteSession(phone);
                    return;
                }

                doctors.forEach((doc, i) => {
                    docMsg += `${i + 1}️⃣ ${doc.name}\n`;
                });
                await sessionManager.updateSession(phone, 'NORMAL_DOC', data);
                await client.sendMessage(phone, docMsg).catch(err => console.error("Send Error:", err));
            } else {
                await client.sendMessage(phone, "❌ Invalid department.");
            }
            break;

        case 'NORMAL_DOC':
            const docIdx = parseInt(text) - 1;
            const doctorsList = departments[data.deptId].doctors;
            if (doctorsList[docIdx]) {
                data.doctor = doctorsList[docIdx].name;
                data.doctorId = doctorsList[docIdx].id; // Save the ID for Supabase!
                data.doctorPhone = doctorsList[docIdx].phone;
                await sessionManager.updateSession(phone, 'NORMAL_NAME', data);
                await client.sendMessage(phone, `Doctor: ${data.doctor}\nPlease enter the *Patient Name*.`);
            } else {
                await client.sendMessage(phone, "❌ Invalid doctor.");
            }
            break;

        case 'NORMAL_NAME':
            data.name = text;
            await sessionManager.updateSession(phone, 'NORMAL_DATE', data);
            await client.sendMessage(phone, `Patient: ${data.name}\nPlease enter *Date* (e.g. 2026-03-25 or Tomorrow).`);
            break;

        case 'NORMAL_DATE':
            data.date = text === 'Tomorrow' ? new Date(Date.now() + 86400000).toISOString().split('T')[0] : text;
            const selectedDate = new Date(data.date);
            const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const dayName = dayNames[selectedDate.getDay()];

            let finalSlots = [];
            const availability = await supabase.getAvailability(data.doctorId, dayName, data.date);

            if (availability === null) {
                // Fallback to hardcoded defaults if DB query fails or no record exists
                const day = selectedDate.getDay();
                finalSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM"];
                if (day !== 0) {
                    finalSlots.push("06:00 PM", "07:00 PM", "08:00 PM");
                }
            } else if (availability.length > 0) {
                // Generate slots from DB ranges
                availability.forEach(slot => {
                    const startHour = parseInt(slot.start_time.split(':')[0]);
                    const endHour = parseInt(slot.end_time.split(':')[0]);
                    
                    for (let h = startHour; h <= endHour; h++) {
                        const hour = h % 24;
                        const ampm = hour >= 12 ? "PM" : "AM";
                        const h12 = hour % 12 || 12;
                        finalSlots.push(`${h12.toString().padStart(2, '0')}:00 ${ampm}`);
                    }
                });
                finalSlots = [...new Set(finalSlots)].sort((a,b) => {
                    return new Date(`2000/01/01 ${a}`) - new Date(`2000/01/01 ${b}`);
                });
            } else {
                // On leave or no slots for this day
                finalSlots = [];
            }

            if (finalSlots.length === 0) {
                await client.sendMessage(phone, `Sorry, no available slots for ${data.date}. Please choose another date.`);
                // Keep state at NORMAL_DATE to let them retry
                return;
            }

            let slotMsg = `Available slots for ${data.date}:\n`;
            for (let i = 0; i < finalSlots.length; i++) {
                const slot = finalSlots[i];
                if (await sessionManager.isSlotAvailable(data.date, slot, data.doctor)) {
                    slotMsg += `${i + 1}️⃣ ${slot}\n`;
                } else {
                    slotMsg += `${i + 1}️⃣ ~~${slot} (Booked)~~ \n`;
                }
            }
            
            data.currentDaySlots = finalSlots;
            await sessionManager.updateSession(phone, 'NORMAL_TIME', data);
            await client.sendMessage(phone, slotMsg).catch(err => console.error("Send Error:", err));
            break;

        case 'NORMAL_TIME':
            const sIdx = parseInt(text) - 1;
            const currentSlots = data.currentDaySlots || config.slots;
            const chosenSlot = currentSlots[sIdx];
            if (chosenSlot && await sessionManager.isSlotAvailable(data.date, chosenSlot, data.doctor)) {
                data.time = chosenSlot;
                const appId = await sessionManager.saveNormalAppointment(data);
                await client.sendMessage(phone, `✅ *Booking Confirmed!*\nID: *${appId}*\nDate: ${data.date}\nTime: ${data.time}\nDoctor: ${data.doctor}\n\nManage your booking at: ${config.websiteUrl}/appointment`);

                // 2. Trigger Unified 4-Way Notification via Website
                try {
                    const cleanPatientPhone = phone.replace(/\D/g, '');
                    await axios.post(`${config.websiteUrl}/api/notify`, {
                        type: 'appointment',
                        data: {
                            patient: { name: data.name, phone: `${cleanPatientPhone}@c.us` },
                            appointment: { date: data.date, time: data.time, id: appId },
                            doctor: { name: data.doctor, speciality: data.department, phone: data.doctorPhone },
                            adminPhone: config.adminPhone,
                            recepPhone: config.receptionistPhone
                        }
                    }, { timeout: 10000 });
                } catch (notifyErr) {
                    console.error("Website Notification Failed:", notifyErr.message);
                }

                await sessionManager.deleteSession(phone);
            } else {
                await client.sendMessage(phone, "❌ Slot unavailable or invalid.");
            }
            break;
    }
}

async function notifyDoctor(client, doctorPhone, details) {
    let alert = "";
    if (details.type === 'EMERGENCY') {
        alert = `🚨 *EMERGENCY ALERT*\nID: ${details.id}\nPatient: ${details.name}\nPhone: ${details.phone.split('@')[0]}\nStatus: Urgent Action Required`;
        await client.sendMessage(doctorPhone, alert);

        // Send reports if any
        if (details.reports && details.reports.length > 0) {
            for (const reportPath of details.reports) {
                const media = MessageMedia.fromFilePath(reportPath);
                await client.sendMessage(doctorPhone, media, { caption: `Report for ${details.id}` });
            }
        }
    } else {
        alert = `🏥 *NEW APPOINTMENT*\nID: ${details.id}\nPatient: ${details.name}\nPhone: ${details.phone.split('@')[0]}\nDept: ${details.dept}\nDate: ${details.date}\nTime: ${details.time}`;
        await client.sendMessage(doctorPhone, alert);
    }
}

startBot().catch(err => console.error(err));
