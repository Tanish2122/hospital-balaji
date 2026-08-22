import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendConsultationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, firstName, lastName, phone, email, message, subject } = body;

    const senderName = name || `${firstName || ""} ${lastName || ""}`.trim() || "Website Visitor";
    const cleanPhone = phone || "Not provided";
    const senderMessage = message || subject || "General Inquiry";

    // 1. Insert into Supabase contact_forms table
    const { error } = await supabase.from("contact_forms").insert([
      {
        name: senderName,
        phone: cleanPhone,
        email: email || null,
        message: senderMessage,
      },
    ]);

    if (error) {
      console.error("[Contact API] Supabase error:", error);
    }

    // 2. Trigger Email Notification to balajihospjprinsurance@gmail.com
    try {
      await sendConsultationEmail({
        patientName: senderName,
        phone: cleanPhone,
        treatment: `📩 MESSAGE: ${senderMessage}`,
        source: "Website Contact / Message Form",
      });
    } catch (emailErr) {
      console.error("[Contact API] Email notification error:", emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Contact API] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
