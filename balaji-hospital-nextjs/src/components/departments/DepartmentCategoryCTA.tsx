"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import AppointmentModal from "../AppointmentModal";

export default function DepartmentCategoryCTA({ metaLabel }: { metaLabel: string }) {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  return (
    <>
      <section className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4 font-poppins">
              Book a Consultation
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              Our {metaLabel.replace(" Department", "")} specialists are
              available 6 days a week. Contact us to schedule your
              appointment.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/appointment"
                className="inline-flex items-center gap-3 px-8 py-4 bg-medical-600 text-white rounded-2xl font-bold hover:bg-medical-700 transition-all shadow-xl"
              >
                Book Appointment <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="tel:+917276229049"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-bold hover:bg-white/20 transition-all"
              >
                +91 7276229049
              </a>
            </div>
          </div>
          <div className="hidden lg:flex flex-col gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="text-3xl font-bold text-medical-400 mb-1">
                25+
              </div>
              <div className="text-slate-400 text-sm">
                Years of Excellence
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="text-3xl font-bold text-accent-400 mb-1">
                24/7
              </div>
              <div className="text-slate-400 text-sm">Emergency Services</div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-medical-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
      </section>

      <AppointmentModal 
        isOpen={isAppointmentModalOpen} 
        onClose={() => setIsAppointmentModalOpen(false)} 
      />
    </>
  );
}
