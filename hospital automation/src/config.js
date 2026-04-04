module.exports = {
    supabaseUrl: "https://yroieafhxcorwitzwyjj.supabase.co",
    supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlyb2llYWZoeGNvcndpdHp3eWpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NzU3OTksImV4cCI6MjA4OTI1MTc5OX0.l57vQCQRCtxIPGajcjF5xiXTB6nIu9MmVg7NJdL32Sw",
    supabaseServiceRoleKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlyb2llYWZoeGNvcndpdHp3eWpqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzY3NTc5OSwiZXhwIjoyMDg5MjUxNzk5fQ.S_LOn9u1AmLGoCpTq6zUKfDghmYB0-QEZWQ_PKMAccU",
    cloudApiAccessToken: "YOUR_ACCESS_TOKEN",
    cloudPhoneNumberId: "YOUR_PHONE_NUMBER_ID",
    webhookVerifyToken: "YOUR_VERIFY_TOKEN",
    hospitalName: "Balaji Hospital & Orthopaedic Centre 🏥",

    // Notification Recipients
    adminPhone: "918290909163@c.us",
    receptionistPhone: "916377433387@c.us",
    testDoctorPhone: "918949518353@c.us",

    // Real departments and doctors from balajihospitaljaipur.com
    fallbackDepartments: {
        "1": {
            name: "Orthopedic",
            doctors: [
                { id: "dr_shitiz", name: "Dr. Shitiz Agarwal", phone: "918949518353@c.us" },
                { id: "dr_ramesh", name: "Dr. Ramesh Agarwal", phone: "918949518353@c.us" }
            ]
        },
        "2": {
            name: "ENT",
            doctors: [
                { id: "dr_utkarsh", name: "Dr. Utkarsh", phone: "918949518353@c.us" }
            ]
        },
        "3": {
            name: "Pediatrics",
            doctors: [
                { id: "dr_utkarsh_gen", name: "Dr. Utkarsh", phone: "918949518353@c.us" }
            ]
        },
        "4": {
            name: "General Medicine",
            doctors: [
                { id: "dr_utkarsh_med", name: "Dr. Utkarsh", phone: "918949518353@c.us" }
            ]
        }
    },
    slots: ["10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"],
    emergencyDoctor: { name: "Dr. Ramesh Agarwal", phone: "918949518353@c.us" },
    ngrokToken: "3Bd332vlf0YDT5MSvsXlX0RTB3q_6aQhgNFB5EyncXNT8DTXe"
};
