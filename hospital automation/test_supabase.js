const supabase = require('./src/supabase_client');
const config = require('./src/config');

async function testSupabase() {
    console.log("--- Supabase Integration Test ---");
    console.log("Target URL:", config.supabaseUrl);
    
    try {
        console.log("Fetching bot data...");
        const data = await supabase.getBotData();
        
        if (data && Object.keys(data).length > 0) {
            console.log("✅ SUCCESS: Data loaded dynamically.");
            console.log("Departments found:", Object.keys(data).length);
            
            Object.entries(data).slice(0, 3).forEach(([id, dept]) => {
                console.log(`- [${id}] ${dept.name} (${dept.doctors.length} doctors)`);
            });
        } else {
            console.log("❌ FAILURE: No data returned from Supabase.");
            console.log("Falling back to internal config...");
        }
    } catch (err) {
        console.error("❌ ERROR during test:", err.message);
    }
}

testSupabase();
