const http = require('http');
const localtunnel = require('localtunnel');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const { setupDatabase } = require('./database');
const SessionManager = require('./sessionManager');
const config = require('./config');
const supabase = require('./supabase_client');

const API_PORT = 3001;

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

    const client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: 'new' // Recommended for newer Puppeteer versions
        }
    });

    console.log('Initializing WhatsApp client...');

    client.on('qr', (qr) => {
        console.log('QR Code received. Scan it with your WhatsApp:');
        qrcode.generate(qr, { small: true });
    });

    client.on('auth_failure', (msg) => {
        console.error('AUTHENTICATION FAILURE:', msg);
    });

    client.on('disconnected', (reason) => {
        console.error('Client was logged out:', reason);
    });

    client.on('ready', () => {
        console.log('Advanced Hospital Bot is ready!');

        // Start HTTP API
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

            if (req.method === 'POST' && req.url === '/send-message') {
                let body = '';
                req.on('data', chunk => { body += chunk.toString(); });
                req.on('end', async () => {
                    try {
                        let { to, message, media } = JSON.parse(body);

                        // Robust number formatting
                        let cleanNumber = to.replace(/\D/g, '');
                        if (cleanNumber.length === 10) cleanNumber = `91${cleanNumber}`;
                        if (!cleanNumber.endsWith('@c.us')) cleanNumber = `${cleanNumber}@c.us`;
                        to = cleanNumber;

                        console.log(`[API] Sending message to ${to}...`);

                        if (media && media.startsWith('http')) {
                            try {
                                const mediaObj = await MessageMedia.fromUrl(media);
                                await client.sendMessage(to, mediaObj, { caption: message });
                            } catch (mediaErr) {
                                console.error('[API] Media Load Error:', mediaErr);
                                await client.sendMessage(to, message);
                            }
                        } else {
                            await client.sendMessage(to, message);
                        }

                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true }));
                    } catch (err) {
                        console.error('[API] Error sending message:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, error: err.message }));
                    }
                });
            } else {
                res.writeHead(404);
                res.end();
            }
        });

        server.listen(API_PORT, async () => {
            console.log(`WhatsApp API Gateway is active for ${config.hospitalName}`);
            console.log(`Local Endpoint: http://localhost:${API_PORT}`);

            // Start Public Tunnel (Exposing local port 3001 to the live website)
            try {
                const tunnel = await localtunnel({ 
                    port: API_PORT,
                    subdomain: 'balaji-hospital-bot' // Try to request a fixed subdomain
                });
                
                console.log(`\n🚀 PUBLIC API URL: ${tunnel.url}`);
                console.log(`👉 Copy this URL into your Next.js '.env.local' as NEXT_PUBLIC_WHATSAPP_API_URL\n`);
                
                tunnel.on('close', () => {
                    console.log('Tunnel was closed.');
                });
            } catch (err) {
                console.error('Error starting localtunnel:', err.message);
                console.log('Falling back to local-only mode.');
            }
        });
    });

    client.on('message', async (msg) => {
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

                // Notify Doctor
                await notifyDoctor(client, config.emergencyDoctor.phone, {
                    type: 'EMERGENCY',
                    id: emgId,
                    name: data.name,
                    phone: phone,
                    reports: data.reports
                });

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
            let slotMsg = `Available slots for ${data.date}:\n`;
            for (let i = 0; i < config.slots.length; i++) {
                const slot = config.slots[i];
                if (await sessionManager.isSlotAvailable(data.date, slot, data.doctor)) {
                    slotMsg += `${i + 1}️⃣ ${slot}\n`;
                } else {
                    slotMsg += `${i + 1}️⃣ ~~${slot} (Booked)~~ \n`;
                }
            }
            await sessionManager.updateSession(phone, 'NORMAL_TIME', data);
            await client.sendMessage(phone, slotMsg).catch(err => console.error("Send Error:", err));
            break;

        case 'NORMAL_TIME':
            const sIdx = parseInt(text) - 1;
            const chosenSlot = config.slots[sIdx];
            if (chosenSlot && await sessionManager.isSlotAvailable(data.date, chosenSlot, data.doctor)) {
                data.time = chosenSlot;
                const appId = await sessionManager.saveNormalAppointment(data);
                await client.sendMessage(phone, `✅ *Booking Confirmed!*\nID: *${appId}*\nDate: ${data.date}\nTime: ${data.time}\nDoctor: ${data.doctor}\n\nManage your booking at: https://hospital-balaji.vercel.app/appointment`);

                // Notify Doctor
                await notifyDoctor(client, data.doctorPhone, {
                    type: 'NORMAL',
                    id: appId,
                    name: data.name,
                    phone: phone,
                    time: data.time,
                    date: data.date,
                    dept: data.department
                });

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
