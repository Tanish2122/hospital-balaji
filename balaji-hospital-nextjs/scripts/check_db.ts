import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function check() {
  try {
    const { data, error } = await supabase.from('site_settings').select('*').eq('key', 'social_feed').maybeSingle()
    if (error) {
       console.log('ERROR:', error.message)
    } else {
       console.log('DATA:', JSON.stringify(data))
    }
  } catch (e: any) {
    console.log('CATCH_ERROR:', e.message)
  }
}

check()
