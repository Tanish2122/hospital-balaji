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
    console.log(`[WhatsApp] Calling API at: ${baseUrl}/send-message`);
    const response = await fetch(`${baseUrl}/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, message, media }),
    });
    const result = await response.json();
    console.log(`[WhatsApp] API Response:`, result);
    return result;
  } catch (error) {
    console.error("WhatsApp delivery failed:", error);
    return { success: false, error };
  }
}

interface BookingNotification {
  patient: { name: string; phone: string };
  appointment: { date: string; time: string; id?: string; no?: number };
  doctor: { name: string; speciality: string; phone?: string };
  adminPhone?: string; // Dynamic admin recipient
  recepPhone?: string; // Dynamic receptionist recipient
}

interface EmergencyNotification {
  patient: { name: string; phone: string };
  id: string;
  doctor: { name: string; phone?: string };
  reportUrl?: string;
  adminPhone?: string; // Dynamic admin recipient
  recepPhone?: string; // Dynamic receptionist recipient
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function notifyBooking(data: BookingNotification) {
  try {
    const { patient, appointment, doctor, adminPhone: dynamicAdmin, recepPhone: dynamicRecep } = data;
    const adminPhone = dynamicAdmin || "917276229049@c.us";
    const recepPhone = dynamicRecep || "919521430632@c.us";
    const testDocPhone = doctor.phone || "917276229049@c.us";

    const apptNo = appointment.no ? `\n🔢 *Appointment No: ${appointment.no}*` : '';

    // 1. Send to Patient (Confirmation)
    await sendWhatsAppMessage({
      to: patient.phone,
      message: `✅ *Appointment Confirmed*\n\nDear ${patient.name},\nYour appointment with *${doctor.name}* (${doctor.speciality}) has been scheduled.\n\n🗓️ Date: *${appointment.date}*\n⏰ Time: *${appointment.time}*${apptNo}\n📍 Location: Balaji Hospital & Orthopaedic Centre 🏥\n\nThank you for choosing us!`
    });

    await sleep(3000); // Wait 3s between messages to clear memory on the bot

    // 2. Send to Admin (8290909163)
    await sendWhatsAppMessage({
      to: adminPhone,
      message: `🏥 *NEW BOOKING ALERT (Admin)*\n\nPatient: ${patient.name}\nPhone: ${patient.phone}\nDoctor: ${doctor.name}\nDept: ${doctor.speciality}\nTime: ${appointment.date} @ ${appointment.time}\n\nSerial No: ${appointment.no || 'N/A'}`
    });

    await sleep(3000);

    // 3. Send to Receptionist (6377433387)
    await sendWhatsAppMessage({
      to: recepPhone,
      message: `🏥 *NEW BOOKING ALERT (Reception)*\n\nPatient: ${patient.name}\nPhone: ${patient.phone}\nDoctor: ${doctor.name}\nDept: ${doctor.speciality}\nTime: ${appointment.date} @ ${appointment.time}\n\nPlease update the register for No: ${appointment.no || 'N/A'}`
    });

    await sleep(3000);

    // 4. Send to Doctor (Specific/Test)
    await sendWhatsAppMessage({
      to: testDocPhone,
      message: `👨‍⚕️ *NEW APPOINTMENT*\n\nYou have a new appointment scheduled.\n\nPatient: ${patient.name}\nDate: ${appointment.date}\nTime: ${appointment.time}\nSerial No: ${appointment.no || 'N/A'}`
    });

    return { success: true };
  } catch (error) {
    console.error("Booking notification failed:", error);
    return { success: false, error };
  }
}

export async function notifyEmergency(data: EmergencyNotification) {
  try {
    const { patient, id, doctor, reportUrl, adminPhone: dynamicAdmin, recepPhone: dynamicRecep } = data;
    const adminPhone = dynamicAdmin || "917276229049@c.us";
    const recepPhone = dynamicRecep || "919521430632@c.us";
    const testDocPhone = doctor.phone || "917276229049@c.us";

    // 1. Send to Patient (Confirmation)
    await sendWhatsAppMessage({
      to: patient.phone,
      message: `🚨 *Emergency Alert Received*\n\nDear ${patient.name},\nYour emergency request has been received (ID: *${id}*).\n\nOur duty doctor *${doctor.name}* has been notified and will contact you immediately.`
    });

    await sleep(3000);

    // 2. Send to Admin (8290909163)
    await sendWhatsAppMessage({
      to: adminPhone,
      message: `🚨 *EMERGENCY ALERT (Admin)*\n\nPatient: ${patient.name}\nPhone: ${patient.phone}\nID: ${id}\nReports: ${reportUrl || "No files attached"}`
    });

    await sleep(3000);

    // 3. Send to Receptionist (6377433387)
    await sendWhatsAppMessage({
      to: recepPhone,
      message: `🚨 *EMERGENCY ALERT (Reception)*\n\nPatient: ${patient.name}\nPhone: ${patient.phone}\nID: ${id}\nPlease alert the nursing staff immediately for ID: ${id}`
    });

    await sleep(3000);

    // 4. Send to Doctor
    await sendWhatsAppMessage({
      to: testDocPhone,
      message: `🚨 *URGENT EMERGENCY*\n\nYou have an urgent emergency patient.\n\nPatient: ${patient.name}\nPhone: ${patient.phone}\nID: ${id}\nReports: ${reportUrl || "None"}`,
      media: reportUrl
    });

    return { success: true };
  } catch (error) {
    console.error("Emergency notification failed:", error);
    return { success: false, error };
  }
}
