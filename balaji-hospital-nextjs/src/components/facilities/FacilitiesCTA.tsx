"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import AppointmentModal from "../AppointmentModal";

export default function FacilitiesCTA() {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  return (
    <>
      <section className="bg-medical-600 rounded-[3rem] p-12 md:p-16 text-white text-center relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4 font-poppins">
            Plan Your Visit
          </h2>
          <p className="text-medical-100 max-w-lg mx-auto mb-8">
            Our team is available Monday to Saturday, 9AM – 5PM. Emergency services 24/7.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/appointment"
              className="px-8 py-4 bg-white text-medical-700 rounded-2xl font-bold hover:bg-medical-50 transition-all inline-flex items-center gap-2"
            >
              Book Appointment <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="tel:+917276229049"
              className="px-8 py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-bold hover:bg-white/20 transition-all"
            >
              +91 7276229049
            </a>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl" />
      </section>

      <AppointmentModal 
        isOpen={isAppointmentModalOpen} 
        onClose={() => setIsAppointmentModalOpen(false)} 
      />
    </>
  );
}
