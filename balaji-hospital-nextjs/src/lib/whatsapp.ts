/**
 * WhatsApp Messaging Utility
 * 
 * In a real production environment, replace the console.logs with actual
 * API calls to your provider (Twilio, WhatsApp Cloud API, etc.)
 */

interface WhatsAppMessage {
  to: string;
  message: string;
  media?: string; // Optional URL or base64
}

export async function sendWhatsAppMessage({ to, message, media }: WhatsAppMessage) {
  try {
    console.log(`--- WHATSAPP SEND LOG ---`);
    console.log(`TO: ${to}`);
    console.log(`MESSAGE: ${message}`);
    if (media) console.log(`ATTACHMENT: ${media}`);
    console.log(`--------------------------`);

    // Call the WhatsApp API Gateway (Hospital Automation)
    const baseUrl = process.env.NEXT_PUBLIC_WHATSAPP_API_URL || "http://localhost:3001";
    const response = await fetch(`${baseUrl}/send-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, message, media }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("WhatsApp delivery failed:", error);
    return { success: false, error };
  }
}
