const axios = require('axios');

class WhatsAppCloudAPI {
    constructor(accessToken, phoneNumberId) {
        this.accessToken = accessToken;
        this.phoneNumberId = phoneNumberId;
        this.baseUrl = `https://graph.facebook.com/v17.0/${this.phoneNumberId}/messages`;
    }

    async sendText(to, text) {
        return this.sendRequest({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: to,
            type: "text",
            text: { body: text }
        });
    }

    async sendList(to, headerText, bodyText, buttonText, sections) {
        return this.sendRequest({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: to,
            type: "interactive",
            interactive: {
                type: "list",
                header: { type: "text", text: headerText },
                body: { text: bodyText },
                footer: { text: "Hospital Booking System" },
                action: {
                    button: buttonText,
                    sections: sections
                }
            }
        });
    }

    async sendRequest(data) {
        try {
            const response = await axios.post(this.baseUrl, data, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error("WhatsApp Cloud API Error:", error.response ? error.response.data : error.message);
            throw error;
        }
    }
}

module.exports = WhatsAppCloudAPI;
