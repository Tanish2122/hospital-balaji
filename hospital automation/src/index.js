const http = require('http');
const ngrok = require('@ngrok/ngrok');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const { setupDatabase } = require('./database');
const SessionManager = require('./sessionManager');
const config = require('./config');
const supabase = require('./supabase_client');

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

    // Dynamic Chrome path for Docker/Render
    let executablePath = '';
    if (process.platform === 'linux') {
        const possiblePaths = [
            '/usr/bin/google-chrome',
            '/usr/bin/google-chrome-stable',
            '/usr/bin/chromium',
            '/usr/bin/chromium-browser'
        ];
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                executablePath = p;
                break;
            }
        }
    }

    let botReady = false;
    let lastQr = null;
    let qrTime = null;

    const client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            executablePath: executablePath || undefined,
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu',
                '--single-process', // Critical for 512MB RAM
                '--disable-extensions',
                '--disable-features=IsolateOrigins,site-per-process', 
                '--js-flags="--max-old-space-size=160"',
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
        console.log(`👉 Status Page: https://hospital-balaji.onrender.com/ (Check here if QR is missing)`);
        
        if (process.platform !== 'linux' && config.ngrokToken) {
            try {
                const listener = await ngrok.connect({ addr: API_PORT, authtoken: config.ngrokToken.trim() });
                console.log(`🚀 PUBLIC API URL: ${listener.url()}`);
            } catch (err) { console.error('Ngrok Error:', err.message); }
        } else {
            console.log('🚀 Running on Render. Public URL is assigned by Render.');
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
        console.log('✅ WhatsApp Authenticated. Starting session...');
    });

    client.on('auth_failure', (msg) => {
        console.error('⚠️ AUTHENTICATION FAILURE:', msg);
        qrTime = null; // Clear old QR status
    });

    client.on('ready', () => {
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

    // --- KEEP ALIVE MECHANISM (For Render Free Tier) ---
    // Pings the server every 5 minutes to prevent it from sleeping
    const keepAliveUrl = process.env.RENDER_EXTERNAL_URL || `https://hospital-balaji.onrender.com`;
    if (keepAliveUrl) {
        console.log(`📡 Keep-alive active. Pinging ${keepAliveUrl} every 5 mins.`);
        setInterval(() => {
            http.get(keepAliveUrl, (res) => {
                // Ping success
            }).on('error', (err) => {
                console.error('Keep-alive ping failed:', err.message);
            });
        }, 300000); // 5 minutes (reduced from 10)
    }
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
