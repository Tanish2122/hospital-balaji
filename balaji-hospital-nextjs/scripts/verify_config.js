
const url = 'https://yroieafhxcorwitzwyjj.supabase.co/rest/v1/app_config?key=eq.social_feed'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlyb2llYWZoeGNvcndpdHp3eWpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NzU3OTksImV4cCI6MjA4OTI1MTc5OX0.l57vQCQRCtxIPGajcjF5xiXTB6nIu9MmVg7NJdL32Sw'

fetch(url, {
  headers: {
    'apikey': key,
    'Authorization': `Bearer ${key}`
  }
})
.then(res => res.json())
.then(data => {
  console.log('--- RAW CONFIG DATA ---');
  console.log(JSON.stringify(data, null, 2));
  console.log('-----------------------');
})
.catch(err => console.error('Fetch Error:', err))
