module.exports = {
    cloudApiAccessToken: "YOUR_ACCESS_TOKEN",
    cloudPhoneNumberId: "YOUR_PHONE_NUMBER_ID",
    webhookVerifyToken: "YOUR_VERIFY_TOKEN",
    hospitalName: "ABC Hospital 🏥",
    adminPhone: "916377433387@c.us", // Replace with actual admin/emergency phone
    departments: {
        "1": {
            name: "Cardiology",
            doctors: [
                { id: "doc1", name: "Dr. Mehta", phone: "916377433387@c.us" },
                { id: "doc2", name: "Dr. Sharma", phone: "916377433387@c.us" }
            ]
        },
        "2": {
            name: "Orthopedic",
            doctors: [
                { id: "doc3", name: "Dr. Khanna", phone: "916377433387@c.us" },
                { id: "doc4", name: "Dr. Singh", phone: "916377433387@c.us" }
            ]
        },
        "3": {
            name: "Dentist",
            doctors: [
                { id: "doc5", name: "Dr. Kapoor", phone: "916377433387@c.us" },
                { id: "doc6", name: "Dr. Reddy", phone: "916377433387@c.us" }
            ]
        }
    },
    slots: ["10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"],
    emergencyDoctor: { name: "Duty Medical Officer", phone: "916377433387@c.us" }
};
