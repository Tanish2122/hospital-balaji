import { NextResponse } from "next/server";
import { notifyBooking, notifyEmergency } from "@/lib/whatsapp";

/**
 * API Endpoint for WhatsApp Bot to trigger 4-way sequential notifications.
 * This offloads the heavy messaging logic from the bot to the website server.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (type === "appointment") {
      // data: { patient, appointment, doctor }
      await notifyBooking(data);
      return NextResponse.json({ success: true });
    }

    if (type === "emergency") {
      // data: { patient, id, doctor, reportUrl }
      await notifyEmergency(data);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Invalid notification type" }, { status: 400 });

  } catch (error: any) {
    console.error("Notify API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
