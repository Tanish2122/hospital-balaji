
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const pixelCoords = [
  { slug: 'elbow', px: 386, py: 232 },
  { slug: 'head', px: 703, py: 118, name: 'Head/Neck', description: 'Specialized care for skull, jaw, and cervical spine conditions.' },
  { slug: 'wrist', px: 273, py: 374 },
  { slug: 'hip', px: 462, py: 520 },
  { slug: 'knee', px: 703, py: 633 },
  { slug: 'ankle', px: 500, py: 797 },
  { slug: 'spine', px: 551, py: 396 }
]

async function updateBatchHotspots() {
  console.log('🚀 Updating all hotspots based on user pixel coordinates...')
  
  for (const item of pixelCoords) {
    const x = (item.px / 1024) * 100
    const y = (item.py / 1024) * 100

    // Upsert (update if exists, insert if it doesn't - specifically for 'head')
    const { data: existing } = await supabase.from('body_parts').select('slug').eq('slug', item.slug).single()

    if (existing) {
      const { error } = await supabase
        .from('body_parts')
        .update({ hotspot_x: x, hotspot_y: y })
        .eq('slug', item.slug)
      
      if (error) console.error(`❌ Error updating ${item.slug}:`, error.message)
      else console.log(`✅ Updated ${item.slug} to (${x.toFixed(2)}, ${y.toFixed(2)})`)
    } else if (item.slug === 'head') {
      const { error } = await supabase
        .from('body_parts')
        .insert({ 
          name: item.name, 
          slug: item.slug, 
          description: item.description,
          hotspot_x: x, 
          hotspot_y: y 
        })
      
      if (error) console.error(`❌ Error inserting ${item.slug}:`, error.message)
      else console.log(`✅ Inserted ${item.slug} at (${x.toFixed(2)}, ${y.toFixed(2)})`)
    }
  }
  
  console.log('✨ Batch update complete!')
}

updateBatchHotspots()
