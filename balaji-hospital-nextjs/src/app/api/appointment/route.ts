import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateId } from "@/lib/id-generator";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { doctors } from "@/data/doctors";
import { hospitals } from "@/lib/hospitals";

// Replace with actual emergency/admin contact (matched with hospital automation bot config)
const ADMIN_WHATSAPP = "916377433387@c.us";

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

      // 2. Send WhatsApp to Doctor/Admin (Hospital Specific)
      await sendWhatsAppMessage({
        to: hospital.doctorPhone,
        message: `🚨 Emergency Alert - ${hospital.name}\n\nPatient: ${patientName}\nPhone: ${phone}\nEmergency ID: ${emgId}\nReports: ${reportUrl || "No files attached"}`,
        media: reportUrl
      });

      // 3. Send WhatsApp to Patient (Standardized Template)
      if (whatsapp || phone) {
        const patientPhone = (whatsapp || phone).replace(/\D/g, "");
        const formattedPatientPhone = patientPhone.length === 10 ? `91${patientPhone}` : patientPhone;
        
        await sendWhatsAppMessage({
          to: `${formattedPatientPhone}@c.us`,
          message: `Hello ${patientName},\n\nYour emergency request has been received at ${hospital.name}.\n\nEmergency ID: *${emgId}*\nOur medical team will contact you immediately.`
        });
      }

      return NextResponse.json({ success: true, id: emgId });

    } else if (type === "non-emergency") {
      const { 
        patientName, whatsapp, doctorId, department, date, slotId, hospitalId,
        appointmentType, previousVisitDate 
      } = body;
      const aptId = generateId("APT");

      // Select hospital (Standardized)
      const hospital = hospitals.find(h => h.id === hospitalId) || hospitals[0];

      // Find doctor details
      let doctor = doctors.find(d => d.id === doctorId);
      let doctorName = doctor ? doctor.name : doctorId;

      // If not in static list, fetch from Supabase
      if (!doctor) {
        const { data: dbDoctor } = await supabase
          .from("doctors")
          .select("name")
          .eq("id", doctorId)
          .single();
        
        if (dbDoctor) {
          doctorName = dbDoctor.name;
        }
      }

      // 1. Get next serial number for this doctor, date, AND time slot
      const { count: existingCount } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("doctor_id", doctorId)
        .eq("appointment_date", date)
        .eq("appointment_time", slotId)
        .not("status", "eq", "CANCELLED");

      const appointmentNo = (existingCount || 0) + 1;


      // 3. Store in Supabase
      const { error } = await supabase
        .from("appointments")
        .insert([{
          appointment_id_str: aptId,
          patient_name: patientName,
          phone: whatsapp,
          whatsapp: whatsapp,
          doctor_id: doctorId,
          doctor_name: doctorName,
          department: department,
          appointment_date: date,
          appointment_time: slotId,
          appointment_no: appointmentNo,
          appointment_type: appointmentType || 'new',
          previous_visit_date: previousVisitDate || null,
          reason: appointmentType === 'followup' ? `Follow-up (Last visit: ${previousVisitDate})` : "General Consultation",
          status: "CONFIRMED"
        }]);

      if (error) throw error;

      // 3. Send WhatsApp to Patient (Standardized Template)
      const patientPhone = whatsapp.replace(/\D/g, "");
      const formattedPatientPhone = patientPhone.length === 10 ? `91${patientPhone}` : patientPhone;

      await sendWhatsAppMessage({
        to: `${formattedPatientPhone}@c.us`,
        message: `Hello ${patientName},\n\nYour appointment is confirmed at ${hospital.name} 🏥\n\nType: *${appointmentType === 'followup' ? 'Follow-Up (Recheck)' : 'New Consultation'}*\nAppointment No: *${appointmentNo}*\nDoctor: ${doctorName}\nDate: ${date}\nTime: ${slotId}`
      });

      // 5. Send WhatsApp to Doctor (Hospital Specific)
      await sendWhatsAppMessage({
        to: (doctor as any)?.phone || hospital.doctorPhone,
        message: `New Appointment at ${hospital.name}\n\nPatient: ${patientName}\nPhone: ${whatsapp}\nTime: ${slotId}\nAppointment No: ${appointmentNo}`
      });

      return NextResponse.json({ success: true, id: aptId });
    }

    return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
