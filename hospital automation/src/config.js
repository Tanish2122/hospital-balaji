module.exports = {
    supabaseUrl: "https://yroieafhxcorwitzwyjj.supabase.co",
    supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlyb2llYWZoeGNvcndpdHp3eWpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NzU3OTksImV4cCI6MjA4OTI1MTc5OX0.l57vQCQRCtxIPGajcjF5xiXTB6nIu9MmVg7NJdL32Sw",
    supabaseServiceRoleKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlyb2llYWZoeGNvcndpdHp3eWpqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzY3NTc5OSwiZXhwIjoyMDg5MjUxNzk5fQ.S_LOn9u1AmLGoCpTq6zUKfDghmYB0-QEZWQ_PKMAccU",
    cloudApiAccessToken: "YOUR_ACCESS_TOKEN",
    cloudPhoneNumberId: "YOUR_PHONE_NUMBER_ID",
    webhookVerifyToken: "YOUR_VERIFY_TOKEN",
    hospitalName: "Balaji Hospital & Orthopaedic Centre 🏥",
    adminPhone: "916377433387@c.us", 
    // Fallback departments (used if dynamic fetching fails)
    fallbackDepartments: {
        "1": {
            name: "Cardiology",
            doctors: [
                { id: "doc1", name: "Dr. Mehta", phone: "916377433387@c.us" }
            ]
        }
    },
    slots: ["10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"],
    emergencyDoctor: { name: "Duty Medical Officer", phone: "916377433387@c.us" }
};
