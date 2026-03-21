import { serve } from "std/http/server.ts"
import { createClient } from 'supabase'

const WHATSAPP_ACCESS_TOKEN = Deno.env.get('WHATSAPP_ACCESS_TOKEN');
const WHATSAPP_PHONE_NUMBER_ID = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

serve(async (req) => {
  try {
    const payload = await req.json();
    const { record, table } = payload;
    
    // Determine target phone and name based on table
    const patientName = record.patient_name || record.name;
    const rawPhone = record.phone;
    const appointmentDate = record.appointment_date || null;
    
    if (!rawPhone) {
      throw new Error('Phone number is missing in the payload');
    }

    // Basic phone formatting for WhatsApp (E.164 without +)
    // Assuming Indian numbers if no country code provided
    let formattedPhone = rawPhone.replace(/\D/g, '');
    if (formattedPhone.length === 10) {
      formattedPhone = `91${formattedPhone}`;
    }

    // Call WhatsApp Business API
    const response = await fetch(
      `https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: formattedPhone,
          type: 'template',
          template: {
            name: 'appointment_confirmation', // Ensure this exists in Meta Dashboard
            language: {
              code: 'en_US',
            },
            components: [
              {
                type: 'body',
                parameters: [
                  { type: 'text', text: patientName },
                  { type: 'text', text: appointmentDate || 'N/A' },
                ],
              },
            ],
          },
        }),
      }
    );

    const result = await response.json();

    // Update the record in Supabase with the notification status
    await supabase
      .from(table)
      .update({
        whatsapp_sent_at: new Date().toISOString(),
        whatsapp_status: response.ok ? 'sent' : 'failed',
        whatsapp_message_id: result.messages?.[0]?.id || null,
        whatsapp_error: response.ok ? null : JSON.stringify(result.error),
      })
      .eq('id', record.id);

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
      status: response.ok ? 200 : 400,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})
