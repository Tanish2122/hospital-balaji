"use client";

import React, { useState } from "react";
import { Phone } from "lucide-react";
import Link from "next/link";
import AppointmentModal from "../AppointmentModal";

export default function DoctorProfileCTA({ doctorName }: { doctorName: string }) {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  return (
    <>
      <h3 className="text-2xl font-bold mb-2 font-poppins">
        Book Appointment
      </h3>
      <p className="text-slate-400 mb-8 text-sm leading-relaxed">
        Secure your consultation with {doctorName} at Balaji Hospital, Jaipur.
      </p>
      <div className="space-y-3">
        <Link
          href="/appointment"
          className="w-full py-4 bg-medical-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-medical-700 transition-all"
        >
          Request Appointment
        </Link>
        <a
          href="tel:+917276229049"
          className="w-full py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
        >
          <Phone className="w-5 h-5" /> +91 7276229049
        </a>
      </div>

      <AppointmentModal 
        isOpen={isAppointmentModalOpen} 
        onClose={() => setIsAppointmentModalOpen(false)} 
      />
    </>
  );
}
