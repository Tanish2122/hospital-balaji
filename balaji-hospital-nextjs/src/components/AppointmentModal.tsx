"use client";

import React, { useState } from "react";
import { X, Calendar, User, Phone, Mail, FileText, Send, Stethoscope } from "lucide-react";
import { supabase } from "@/lib/supabase";

const DEPARTMENTS = [
  "Orthopedic",
  "ENT",
  "Plastic & Vascular Surgery",
  "Physiotherapy",
  "General Surgery",
  "Emergency / Trauma",
];

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDepartment?: string;
}

export default function AppointmentModal({ isOpen, onClose, defaultDepartment = "Orthopedic" }: AppointmentModalProps) {
  const [formData, setFormData] = useState({
    patientName: "",
    phone: "",
    email: "",
    department: defaultDepartment,
    appointmentDate: "",
    reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Strict phone validation: only digits, max 10
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const { error } = await supabase.from("appointments").insert([
        {
          patient_name: formData.patientName,
          phone: formData.phone,
          email: formData.email || null,
          appointment_date: formData.appointmentDate,
          reason: formData.reason || null,
        },
      ]);

      if (error) {
        throw error;
      }

      setStatus("success");
      setFormData({
        patientName: "",
        phone: "",
        email: "",
        department: defaultDepartment,
        appointmentDate: "",
        reason: "",
      });
      // Auto close after 3 seconds on success
      setTimeout(() => {
        onClose();
        setStatus("idle");
      }, 3000);
    } catch (error: any) {
      console.error("Error booking appointment:", error);
      setStatus("error");
      setErrorMessage(error.message || "Failed to book appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 text-left">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        <div className="sticky top-0 bg-white/90 backdrop-blur-md px-8 py-6 border-b border-slate-100 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-poppins">Book an Appointment</h2>
            <p className="text-slate-500 text-sm mt-1">Schedule a consultation with our specialists</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          {status === "success" && (
            <div className="p-4 mb-6 text-sm text-green-800 rounded-2xl bg-green-50 border border-green-100 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 shrink-0">
                ✓
              </span>
              <div>
                <span className="font-bold block">Appointment Request Sent!</span> 
                Our team will contact you shortly to confirm the exact time.
              </div>
            </div>
          )}
          {status === "error" && (
            <div className="p-4 mb-6 text-sm text-red-800 rounded-2xl bg-red-50 border border-red-100">
              <span className="font-bold">Error!</span> {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                  <User className="w-3 h-3" /> Patient Name *
                </label>
                <input 
                  type="text" 
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  required 
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 transition-all font-medium text-slate-900 placeholder:text-slate-400" 
                  placeholder="Full Name" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                  <Phone className="w-3 h-3" /> Phone Number *
                </label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required 
                  pattern="[0-9]{10}"
                  maxLength={10}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 transition-all font-medium text-slate-900 placeholder:text-slate-400" 
                  placeholder="10-digit Phone Number" 
                />
                {formData.phone && formData.phone.length < 10 && (
                  <p className="text-[10px] text-red-500 font-bold ml-2">Must be exactly 10 digits</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Email Address
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 transition-all font-medium text-slate-900 placeholder:text-slate-400" 
                  placeholder="Optional" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                  <Stethoscope className="w-3 h-3" /> Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 transition-all font-medium text-slate-900"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Preferred Date *
              </label>
              <input 
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                required 
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 transition-all font-medium text-slate-900" 
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                <FileText className="w-3 h-3" /> Reason for Visit
              </label>
              <textarea 
                rows={3} 
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 transition-all font-medium text-slate-900 placeholder:text-slate-400 resize-none" 
                placeholder="Briefly describe your symptoms or reason for appointment"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full bg-medical-600 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-medical-500/20 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-medical-700 active:scale-[0.98]"
              }`}
            >
              <span>{isSubmitting ? "Submitting..." : "Confirm Appointment"}</span>
              {!isSubmitting && <Send className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
