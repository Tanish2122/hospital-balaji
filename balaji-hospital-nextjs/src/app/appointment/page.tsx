import React from "react";
import Container from "@/components/ui/Container";
import AppointmentController from "@/components/appointment/AppointmentController";

export const metadata = {
  title: "Book an Appointment | Balaji Hospital & Orthopaedic Centre",
  description: "Schedule your visit at Balaji Hospital & Orthopaedic Centre. Choose between Emergency and Non-Emergency appointment flows.",
};

export default function AppointmentPage() {
  return (
    <main className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 font-poppins">
              Appointment <span className="text-medical-600 underline decoration-medical-100 italic">Centre</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
              We provide two distinct pathways to ensure you get the right care at the right time.
            </p>
          </div>

          <AppointmentController />
          
          <div className="mt-16 text-center">
            <p className="text-slate-400 text-sm font-semibold flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              For critical emergencies, please call our 24/7 helpline: 
              <a href="tel:+917276229049" className="text-red-600 hover:underline">+91 7276229049</a>
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}
