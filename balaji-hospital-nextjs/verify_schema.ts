import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://yroieafhxcorwitzwyjj.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlyb2llYWZoeGNvcndpdHp3eWpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NzU3OTksImV4cCI6MjA4OTI1MTc5OX0.l57vQCQRCtxIPGajcjF5xiXTB6nIu9MmVg7NJdL32Sw"

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function verify() {
  console.log("--- START VERIFICATION ---");
  
  console.log("1. Checking 'emergencies' table...");
  const { data: emgData, error: emgError } = await supabase
    .from('emergencies')
    .select('emergency_id_str')
    .limit(1);

  if (emgError) {
    console.log("Result for emergencies: FAIL");
    console.log("Error Message:", emgError.message);
  } else {
    console.log("Result for emergencies: SUCCESS");
    console.log("✓ 'emergency_id_str' exists.");
  }

  console.log("\n2. Checking 'appointments' table...");
  const { data: aptData, error: aptError } = await supabase
    .from('appointments')
    .select('appointment_id_str, doctor_name, department')
    .limit(1);

  if (aptError) {
    console.log("Result for appointments: FAIL");
    console.log("Error Message:", aptError.message);
  } else {
    console.log("Result for appointments: SUCCESS");
    console.log("✓ All new columns exist.");
  }
  
  console.log("--- END VERIFICATION ---");
}

verify()
