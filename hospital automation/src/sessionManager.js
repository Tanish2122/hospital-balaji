const crypto = require('crypto');
const supabase = require('./supabase_client');

class SessionManager {
    constructor(db) {
        this.db = db;
    }

    // Generate unique user-friendly IDs
    generateId(prefix) {
        const random = crypto.randomBytes(2).toString('hex').toUpperCase();
        return `${prefix}-${new Date().getTime().toString().slice(-4)}-${random}`;
    }

    async getSession(phone) {
        const session = await this.db.get('SELECT * FROM sessions WHERE phone = ?', phone);
        if (session) {
            return {
                ...session,
                data: JSON.parse(session.data)
            };
        }
        return null;
    }

    async createSession(phone) {
        const initialData = JSON.stringify({ reports: [] });
        await this.db.run('INSERT OR REPLACE INTO sessions (phone, state, data) VALUES (?, ?, ?)', phone, 'START', initialData);
        return { phone, state: 'START', data: { reports: [] } };
    }

    async updateSession(phone, state, data) {
        await this.db.run('UPDATE sessions SET state = ?, data = ? WHERE phone = ?', state, JSON.stringify(data), phone);
    }

    async deleteSession(phone) {
        await this.db.run('DELETE FROM sessions WHERE phone = ?', phone);
    }

    // Advanced persistence methods
    async saveNormalAppointment(data) {
        const appointmentIdStr = this.generateId('APP');
        
        // 1. Save to local SQLite (Backup)
        await this.db.run(
            `INSERT INTO appointments (appointment_id_str, patient_phone, patient_name, doctor_name, department, appointment_date, appointment_time) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [appointmentIdStr, data.phone, data.name, data.doctor, data.department, data.date, data.time]
        );

        // 2. Sync to Supabase (Primary for Website)
        const cleanPhone = data.phone.replace(/\D/g, '');
        await supabase.insertAppointment({
            appointment_id_str: appointmentIdStr,
            patient_name: data.name,
            phone: cleanPhone,
            whatsapp: cleanPhone,
            doctor_id: data.doctorId || data.doctor?.toLowerCase().replace(/\s+/g, '-'),
            doctor_name: data.doctor,
            department: data.department,
            appointment_date: data.date,
            appointment_time: data.time,
            status: "CONFIRMED"
        });

        return appointmentIdStr;
    }

    async saveEmergencyRequest(data) {
        const emergencyIdStr = this.generateId('EMG');
        const reportUrl = data.reports && data.reports.length > 0 ? data.reports[0].url : null;
        
        // 1. Save to local SQLite (Backup)
        await this.db.run(
            `INSERT INTO emergency_requests (emergency_id_str, patient_name, patient_phone, report_paths) 
             VALUES (?, ?, ?, ?)`,
            [emergencyIdStr, data.name, data.phone, JSON.stringify(data.reports || [])]
        );

        // 2. Sync to Supabase (Primary for Website)
        const cleanPhone = data.phone.replace(/\D/g, '');
        await supabase.insertEmergency({
            emergency_id_str: emergencyIdStr,
            patient_name: data.name,
            phone: cleanPhone,
            whatsapp: cleanPhone,
            description: "Emergency booking via WhatsApp bot",
            report_url: reportUrl,
            status: "PENDING"
        });

        return emergencyIdStr;
    }

    async isSlotAvailable(date, time, doctorName) {
        const booking = await this.db.get(
            'SELECT id FROM appointments WHERE appointment_date = ? AND appointment_time = ? AND doctor_name = ? AND status != "CANCELLED"',
            [date, time, doctorName]
        );
        return !booking;
    }
}

module.exports = SessionManager;
