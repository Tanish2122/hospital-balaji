// require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugData() {
  console.log('Fetching departments...');
  const { data: depts, error: deptError } = await supabase.from('departments').select('id, name');
  if (deptError) console.error('Dept Error:', deptError);
  else console.log('Departments:', JSON.stringify(depts, null, 2));

  console.log('Fetching doctors...');
  const { data: docs, error: docError } = await supabase.from('doctors').select('id, name, department_id, departments(name)');
  if (docError) console.error('Doc Error:', docError);
  else console.log('Doctors:', JSON.stringify(docs, null, 2));
}

debugData();
