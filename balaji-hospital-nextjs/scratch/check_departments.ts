import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://yroieafhxcorwitzwyjj.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlyb2llYWZoeGNvcndpdHp3eWpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NzU3OTksImV4cCI6MjA4OTI1MTc5OX0.l57vQCQRCtxIPGajcjF5xiXTB6nIu9MmVg7NJdL32Sw"

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function check() {
  const { data, error } = await supabase.from('departments').select('*');
  console.log("Departments Error:", error);
  console.log("Departments Data:", JSON.stringify(data, null, 2));
}

check();
