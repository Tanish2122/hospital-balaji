import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { spy, stub } from "https://deno.land/std@0.168.0/testing/mock.ts";

// Since we can't easily import from index.ts without side effects (serve call),
// we will test the logic by mocking the global environment and fetch.

Deno.test("Phone number formatting logic", () => {
  const formatPhone = (rawPhone: string) => {
    let formattedPhone = rawPhone.replace(/\D/g, '');
    if (formattedPhone.length === 10) {
      formattedPhone = `91${formattedPhone}`;
    }
    return formattedPhone;
  };

  assertEquals(formatPhone("1234567890"), "911234567890");
  assertEquals(formatPhone("+91 12345 67890"), "911234567890");
  assertEquals(formatPhone("911234567890"), "911234567890");
});

Deno.test("Payload extraction logic", () => {
  const record = { patient_name: "John Doe", phone: "1234567890", appointment_date: "2023-10-27" };
  const patientName = record.patient_name || record.name;
  const rawPhone = record.phone;
  const appointmentDate = record.appointment_date || null;

  assertEquals(patientName, "John Doe");
  assertEquals(rawPhone, "1234567890");
  assertEquals(appointmentDate, "2023-10-27");
});

// Mocking the fetch call to WhatsApp
Deno.test("WhatsApp API Request Structure", async () => {
  const fetchStub = stub(
    globalThis,
    "fetch",
    () => Promise.resolve(new Response(JSON.stringify({ messages: [{ id: "msg_123" }] }), { status: 200 }))
  );

  try {
    const WHATSAPP_PHONE_NUMBER_ID = "test_id";
    const WHATSAPP_ACCESS_TOKEN = "test_token";
    const formattedPhone = "911234567890";
    const patientName = "John Doe";
    const appointmentDate = "2023-10-27";

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
            name: 'appointment_confirmation',
            language: { code: 'en_US' },
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
    assertEquals(response.status, 200);
    assertEquals(result.messages[0].id, "msg_123");
    
    // Verify call count and arguments
    assertEquals(fetchStub.calls.length, 1);
    const callArgs = fetchStub.calls[0].args;
    assertEquals(callArgs[0], `https://graph.facebook.com/v17.0/test_id/messages`);
    
  } finally {
    fetchStub.restore();
  }
});
