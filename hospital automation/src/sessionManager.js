const crypto = require('crypto');

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
        await this.db.run(
            `INSERT INTO appointments (appointment_id_str, patient_phone, patient_name, doctor_name, department, appointment_date, appointment_time) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [appointmentIdStr, data.phone, data.name, data.doctor, data.department, data.date, data.time]
        );
        return appointmentIdStr;
    }

    async saveEmergencyRequest(data) {
        const emergencyIdStr = this.generateId('EMG');
        await this.db.run(
            `INSERT INTO emergency_requests (emergency_id_str, patient_name, patient_phone, report_paths) 
             VALUES (?, ?, ?, ?)`,
            [emergencyIdStr, data.name, data.phone, JSON.stringify(data.reports || [])]
        );
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
