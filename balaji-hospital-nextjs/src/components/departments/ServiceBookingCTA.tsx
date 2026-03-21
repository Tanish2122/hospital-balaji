"use client";

import React, { useState } from "react";
import { Calendar, User, Phone, Send, Stethoscope } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ServiceBookingCTAProps {
  serviceName: string;
  category: string; // e.g. "Orthopedic", "ENT", "Speciality"
}

const DEPARTMENTS = [
  "Orthopedic",
  "ENT",
  "Plastic & Vascular Surgery",
  "Physiotherapy",
  "General Surgery",
  "Emergency",
];

export default function ServiceBookingCTA({ serviceName, category }: ServiceBookingCTAProps) {
  const [formData, setFormData] = useState({
    patientName: "",
    phone: "",
    appointmentDate: "",
    department: category, // Pre-selected from the service page
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const v = value.replace(/\D/g, "").slice(0, 10);
      setFormData((p) => ({ ...p, phone: v }));
      return;
    }
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");
    setErrorMsg("");

    try {
      const { error } = await supabase.from("appointments").insert([
        {
          patient_name: formData.patientName,
          phone: formData.phone,
          appointment_date: formData.appointmentDate,
          reason: `${formData.department} consultation — ${serviceName}`,
        },
      ]);

      if (error) throw error;

      setStatus("success");
      setFormData((p) => ({
        ...p,
        patientName: "",
        phone: "",
        appointmentDate: "",
      }));
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Failed to submit. Please call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-slate-900 rounded-[2rem] text-white">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-medical-600 rounded-xl flex items-center justify-center">
          <Stethoscope className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold font-poppins">Book Appointment</h3>
          <p className="text-slate-400 text-xs">Quick 30-second form</p>
        </div>
      </div>

      {status === "success" && (
        <div className="p-4 mb-6 bg-green-900/40 border border-green-500/30 rounded-2xl text-green-300 text-sm font-semibold">
          ✓ Request received! Our team will call you to confirm.
        </div>
      )}

      {status === "error" && (
        <div className="p-4 mb-6 bg-red-900/40 border border-red-500/30 rounded-2xl text-red-300 text-sm">
          {errorMsg}
        </div>
      )}

      {status !== "success" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient Name */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <User className="w-3 h-3" /> Your Name *
            </label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              required
              placeholder="Full Name"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 text-sm font-medium outline-none focus:border-medical-500 transition-colors"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3 h-3" /> Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              placeholder="10-digit number"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 text-sm font-medium outline-none focus:border-medical-500 transition-colors"
            />
          </div>

          {/* Department — pre-selected */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <Stethoscope className="w-3 h-3" /> Department
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm font-medium outline-none focus:border-medical-500 transition-colors"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3 h-3" /> Preferred Date *
            </label>
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm font-medium outline-none focus:border-medical-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-medical-600 hover:bg-medical-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-medical-900/40 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : "active:scale-[0.98]"
            }`}
          >
            <span>{isSubmitting ? "Submitting..." : "Confirm Appointment"}</span>
            {!isSubmitting && <Send className="w-4 h-4" />}
          </button>
        </form>
      )}
    </div>
  );
}
