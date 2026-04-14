const axios = require('axios');
const config = require('./config');

class SupabaseClient {
    constructor() {
        this.url = config.supabaseUrl;
        // Prefer service role key for backend operations
        this.key = config.supabaseServiceRoleKey || config.supabaseKey;
        this.headers = {
            'apikey': this.key,
            'Authorization': `Bearer ${this.key}`,
            'Content-Type': 'application/json'
        };
        this.requestTimeout = 60000; // 60 seconds
    }

    async getDepartments() {
        try {
            const response = await axios.get(`${this.url}/rest/v1/departments?select=name`, {
                headers: this.headers,
                timeout: this.requestTimeout
            });
            // Convert to a flat list or the format expected by the bot
            return response.data;
        } catch (error) {
            console.error("Supabase Get Departments Error:", error.message);
            return null;
        }
    }

    async getDoctors() {
        try {
            // Fetch doctors and their associated departments, include on_leave field
            const response = await axios.get(`${this.url}/rest/v1/doctors?select=id,name,on_leave,departments(name)`, {
                headers: this.headers,
                timeout: this.requestTimeout
            });
            return response.data;
        } catch (error) {
            console.error("Supabase Get Doctors Error:", error.message);
            return null;
        }
    }

    /**
     * Helper to get structured data for the bot
     */
    async getBotData() {
        const departmentsData = await this.getDepartments();
        const doctorsData = await this.getDoctors();

        if (!departmentsData || !doctorsData) return null;

        // Map doctors to departments for the bot's conversational flow
        const departments = {};
        
        departmentsData.forEach((dept, index) => {
            const id = (index + 1).toString();
            departments[id] = {
                name: dept.name,
                doctors: doctorsData
                    .filter(doc => doc.departments && doc.departments.name === dept.name && !doc.on_leave)
                    .map(doc => ({
                        id: doc.id,
                        name: doc.name,
                        phone: config.adminPhone // Fallback phone for notifications
                    }))
            };
        });

        return departments;
    }

    async uploadSession(fileBuffer) {
        try {
            console.log("📤 Uploading session to Supabase Storage...");
            const response = await axios.post(
                `${this.url}/storage/v1/object/whatsapp-sessions/session.tar.gz`,
                fileBuffer,
                {
                    headers: {
                        ...this.headers,
                        'Content-Type': 'application/x-gzip',
                        'x-upsert': 'true'
                    },
                    timeout: this.requestTimeout
                }
            );
            return response.data;
        } catch (error) {
            console.error("Supabase Upload Error:", error.response?.data || error.message);
            return null;
        }
    }

    async downloadSession() {
        try {
            console.log("📥 Downloading session from Supabase Storage...");
            const response = await axios.get(
                `${this.url}/storage/v1/object/authenticated/whatsapp-sessions/session.tar.gz`,
                {
                    headers: this.headers,
                    responseType: 'arraybuffer',
                    timeout: this.requestTimeout
                }
            );
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                console.log("ℹ️ No saved session found in Supabase.");
            } else {
                console.error("Supabase Download Error:", error.response?.data?.toString() || error.message);
            }
            return null;
        }
    }

    async insertAppointment(data) {
        try {
            console.log(`📡 Syncing appointment ${data.appointment_id_str} to Supabase...`);
            const response = await axios.post(`${this.url}/rest/v1/appointments`, data, {
                headers: {
                    ...this.headers,
                    'Prefer': 'return=representation'
                },
                timeout: this.requestTimeout
            });
            return response.data;
        } catch (error) {
            const errMsg = error.response?.data?.message || error.response?.data?.error || error.message;
            const errDetails = error.response?.data?.details || "";
            console.error(`❌ Supabase Insert Appointment Error: ${errMsg}`, errDetails);
            return null;
        }
    }

    async insertEmergency(data) {
        try {
            console.log(`📡 Syncing emergency alert ${data.emergency_id_str} to Supabase...`);
            const response = await axios.post(`${this.url}/rest/v1/emergencies`, data, {
                headers: {
                    ...this.headers,
                    'Prefer': 'return=representation'
                },
                timeout: this.requestTimeout
            });
            return response.data;
        } catch (error) {
            const errMsg = error.response?.data?.message || error.response?.data?.error || error.message;
            console.error(`❌ Supabase Insert Emergency Error: ${errMsg}`);
            return null;
        }
    }
}

module.exports = new SupabaseClient();
