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
    const baseUrl = process.env.NEXT_PUBLIC_WHATSAPP_API_URL || "http://localhost:3001";
    const response = await fetch(`${baseUrl}/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, message, media }),
    });
    return await response.json();
  } catch (error) {
    console.error("WhatsApp delivery failed:", error);
    return { success: false, error };
  }
}

interface BookingNotification {
  patient: { name: string; phone: string };
  appointment: { date: string; time: string; id?: string };
  doctor: { name: string; speciality: string; phone?: string };
}

export async function notifyBooking(data: BookingNotification) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_WHATSAPP_API_URL || "http://localhost:3001";
    const response = await fetch(`${baseUrl}/notify-booking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Booking notification failed:", error);
    return { success: false, error };
  }
}
