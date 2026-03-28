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
    }

    async getDepartments() {
        try {
            const response = await axios.get(`${this.url}/rest/v1/departments?select=name`, {
                headers: this.headers
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
            // Fetch doctors and their associated departments
            const response = await axios.get(`${this.url}/rest/v1/doctors?select=id,name,departments(name)`, {
                headers: this.headers
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
                    .filter(doc => doc.departments && doc.departments.name === dept.name)
                    .map(doc => ({
                        id: doc.id,
                        name: doc.name,
                        phone: config.adminPhone // Fallback phone for notifications
                    }))
            };
        });

        return departments;
    }
}

module.exports = new SupabaseClient();
