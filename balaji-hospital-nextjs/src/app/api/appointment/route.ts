import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateId } from "@/lib/id-generator";
import { sendWhatsAppMessage, notifyBooking, notifyEmergency } from "@/lib/whatsapp";
import { sendConsultationEmail } from "@/lib/email";
import { doctors } from "@/data/doctors";
import { hospitals } from "@/lib/hospitals";


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type } = body;

    if (type === "emergency") {
      const { patientName, phone, whatsapp, description, reportUrl, hospitalId } = body;
      const emgId = generateId("EMG");

      // Select hospital (Standardized)
      const hospital = hospitals.find(h => h.id === hospitalId) || hospitals[0];

      // 1. Store in Supabase
      const { error } = await supabase
        .from("emergencies")
        .insert([{
          emergency_id_str: emgId,
          patient_name: patientName,
          phone: phone,
          whatsapp: whatsapp || null,
          description: description,
          report_url: reportUrl,
          status: "PENDING"
        }]);

      if (error) throw error;

      // 2. Trigger Unified Emergency Notification (Patient, Admin, Receptionist, Doctor)
      const patientPhoneRaw = (whatsapp || phone).replace(/\D/g, "");
      const formattedPatientPhone = patientPhoneRaw.length === 10 ? `91${patientPhoneRaw}` : patientPhoneRaw;

      await notifyEmergency({
        patient: { name: patientName, phone: `${formattedPatientPhone}@c.us` },
        id: emgId,
        doctor: { 
          name: "Duty Doctor", // Hospital type doesn't have doctorName
          phone: hospital.doctorPhone 
        },
        reportUrl: reportUrl
      });

      return NextResponse.json({ success: true, id: emgId });

    } else if (type === "non-emergency") {
      const { 
        patientName, whatsapp, phone, doctorId, department, date, slotId, hospitalId,
        appointmentType, previousVisitDate, email, reason: customReason, isPopupForm 
      } = body;
      const aptId = generateId("APT");
      const cleanPhone = whatsapp || phone;
      const apptDate = date || new Date().toISOString().split("T")[0];
      const apptSlot = slotId || "Free Consultation Request";

      // Select hospital (Standardized)
      const hospital = hospitals.find(h => h.id === hospitalId) || hospitals[0];

      // Find doctor details
      let doctor = doctors.find(d => d.id === doctorId);
      let doctorName = doctor ? doctor.name : (doctorId || "Duty Doctor");

      // If not in static list, fetch from Supabase
      if (doctorId && !doctor) {
        const { data: dbDoctor } = await supabase
          .from("doctors")
          .select("name")
          .eq("id", doctorId)
          .single();
        
        if (dbDoctor) {
          doctorName = dbDoctor.name;
        }
      }

      // 1. Get next serial number for this doctor on this specific date
      const { count: existingCount } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("doctor_id", doctorId || null)
        .eq("appointment_date", apptDate)
        .not("status", "eq", "CANCELLED");

      const appointmentNo = (existingCount || 0) + 1;


      // 3. Store in Supabase
      const { error } = await supabase
        .from("appointments")
        .insert([{
          appointment_id_str: aptId,
          patient_name: patientName,
          phone: cleanPhone,
          email: email || null,
          whatsapp: cleanPhone,
          doctor_id: doctorId || null,
          doctor_name: doctorName,
          department: department,
          appointment_date: apptDate,
          appointment_time: apptSlot,
          appointment_no: appointmentNo,
          appointment_type: appointmentType || 'new',
          previous_visit_date: previousVisitDate || null,
          reason: customReason || (appointmentType === 'followup' ? `Follow-up (Last visit: ${previousVisitDate})` : "General Consultation"),
          status: "CONFIRMED"
        }]);

      if (error) throw error;

      // 4. Trigger Email Notification to balajihospjprinsurance@gmail.com
      try {
        await sendConsultationEmail({
          patientName,
          phone: cleanPhone,
          treatment: department || "General Consultation",
          source: isPopupForm ? "Free Consultation Popup Form" : "Website Appointment Form",
        });
      } catch (emailErr) {
        console.error("Email notification error:", emailErr);
      }

      // 5. Trigger Unified WhatsApp Notification (Patient, Admin, Doctor)
      try {
        await notifyBooking({
          patient: { name: patientName, phone: cleanPhone },
          appointment: { 
            date: apptDate, 
            time: apptSlot, 
            id: aptId,
            no: appointmentNo // Added serial number
          } as any,
          doctor: { 
            name: doctorName, 
            speciality: department || "General",
            phone: (doctor as any)?.phone 
          }
        });
      } catch (waErr) {
        console.error("WhatsApp notification error:", waErr);
      }

      return NextResponse.json({ success: true, id: aptId });
    }

    return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Prevent 405 on accidental GET requests
export async function GET() {
  return new Response("Method Not Allowed", { status: 405 });
}
