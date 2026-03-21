"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import AppointmentModal from "../AppointmentModal";

export default function AboutCTA() {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  return (
    <>
      <section className="bg-medical-600 rounded-[3rem] p-12 md:p-16 text-white text-center relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-poppins">
            Experience the Balaji Difference
          </h2>
          <p className="text-medical-100 max-w-xl mx-auto text-lg mb-10">
            Consult our senior specialists today. Walk-ins welcome, or call us for an appointment.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setIsAppointmentModalOpen(true)}
              className="px-8 py-4 bg-white text-medical-600 rounded-2xl font-bold hover:bg-medical-50 transition-all shadow-xl inline-flex items-center gap-2"
            >
              Book an Appointment <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="tel:+917276229049"
              className="px-8 py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-bold hover:bg-white/20 transition-all inline-flex items-center gap-2"
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
