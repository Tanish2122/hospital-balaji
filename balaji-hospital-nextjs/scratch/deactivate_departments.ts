import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://yroieafhxcorwitzwyjj.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlyb2llYWZoeGNvcndpdHp3eWpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NzU3OTksImV4cCI6MjA4OTI1MTc5OX0.l57vQCQRCtxIPGajcjF5xiXTB6nIu9MmVg7NJdL32Sw"

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function deactivate() {
  console.log("Deactivating kidney-stones and best-acl-surgeon-in-jaipur in Supabase...");

  const { data, error } = await supabase
    .from('departments')
    .update({ is_active: false })
    .in('slug', ['kidney-stones', 'best-acl-surgeon-in-jaipur', 'best-pcl-surgeon-in-jaipur']);

  if (error) {
    console.error("Error updating Supabase:", error);
  } else {
    console.log("Successfully deactivated target departments in Supabase.");
  }
}

deactivate();
