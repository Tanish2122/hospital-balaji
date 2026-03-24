
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://yroieafhxcorwitzwyjj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlyb2llYWZoeGNvcndpdHp3eWpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NzU3OTksImV4cCI6MjA4OTI1MTc5OX0.l57vQCQRCtxIPGajcjF5xiXTB6nIu9MmVg7NJdL32Sw'
)

async function checkSchema() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Error fetching site_settings:', JSON.stringify(error, null, 2))
  } else {
    console.log('Sample data from site_settings:', data)
  }
}

checkSchema()
