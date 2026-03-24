"use client";

import React, { useState } from "react";
import { User, MessageSquare, Calendar, Send, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import DoctorSelector from "./DoctorSelector";
import TimeSlotPicker from "./TimeSlotPicker";

export default function NonEmergencyForm() {
  const [formData, setFormData] = useState({
    patientName: "",
    whatsapp: "",
    department: "",
    doctorId: "",
    date: "",
    slotId: "",
    appointmentType: "new" as "new" | "followup",
    previousVisitDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Strict phone/whatsapp validation: only digits, max 10
    if (name === "whatsapp") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDoctorSelect = (doctorId: string, department: string) => {
    setFormData((prev) => ({ ...prev, doctorId, department, slotId: "" }));
  };

  const handleSlotSelect = (slotId: string) => {
    setFormData((prev) => ({ ...prev, slotId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.doctorId || !formData.slotId) {
      alert("Please select a doctor and a time slot.");
      return;
    }
    
    setIsSubmitting(true);
    setStatus("idle");
    
    try {
      // Call Backend API
      const response = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "non-emergency",
          patientName: formData.patientName,
          whatsapp: formData.whatsapp,
          doctorId: formData.doctorId,
          department: formData.department,
          date: formData.date,
          slotId: formData.slotId,
          appointmentType: formData.appointmentType,
          previousVisitDate: formData.appointmentType === "followup" ? formData.previousVisitDate : null,
        }),
      });

      const result = await response.json();

      if (!result.success) throw new Error(result.error || "Failed to book appointment");

      setStatus("success");
      setFormData({
        patientName: "",
        whatsapp: "",
        department: "",
        doctorId: "",
        date: "",
        slotId: "",
        appointmentType: "new",
        previousVisitDate: "",
      });
    } catch (error: any) {
      console.error("Error booking appointment:", error);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "success") {
    return (
      <div className="bg-medical-50 border-2 border-medical-100 rounded-[2.5rem] p-12 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-medical-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-medical-200">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-3xl font-bold text-slate-900 mb-4 font-poppins">Appointment Confirmed!</h3>
        <p className="text-medical-700 text-lg max-w-md mx-auto leading-relaxed font-medium">
          Your appointment request has been submitted successfully. You will receive a confirmation message on WhatsApp shortly.
        </p>
        <button 
          onClick={() => setStatus("idle")}
          className="mt-10 text-medical-600 font-bold hover:underline"
        >
          Book another appointment
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-2xl shadow-slate-100 relative overflow-hidden">
      {/* Decorative indicator */}
      <div className="absolute top-0 left-0 w-full h-2 bg-medical-500" />

      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-medical-50 rounded-2xl flex items-center justify-center text-medical-600">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-poppins">Book an Appointment</h2>
          <p className="text-slate-500 text-sm">Schedule a consultation with our experienced specialists</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Personal Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
              <User className="w-3 h-3" /> Patient Name *
            </label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-medical-500/10 focus:border-medical-500 transition-all font-semibold text-slate-900"
              placeholder="Full Name"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
              <MessageSquare className="w-3 h-3" /> WhatsApp Number *
            </label>
            <input
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              maxLength={10}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-medical-500/10 focus:border-medical-500 transition-all font-semibold text-slate-900"
              placeholder="10-digit WhatsApp No"
            />
            {formData.whatsapp && formData.whatsapp.length < 10 && (
              <p className="text-[10px] text-red-500 font-bold ml-2">Must be exactly 10 digits</p>
            )}
          </div>
        </div>

        {/* Appointment Type Selection */}
        <div className="pt-8 border-t border-slate-50">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 mb-6 block">
            Appointment Type *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              onClick={() => setFormData(prev => ({ ...prev, appointmentType: 'new' }))}
              className={cn(
                "p-5 rounded-3xl border-2 transition-all cursor-pointer flex items-center gap-4",
                formData.appointmentType === 'new' 
                  ? "border-medical-500 bg-medical-50/50 shadow-lg shadow-medical-100/50" 
                  : "border-slate-100 bg-white hover:border-slate-200"
              )}
            >
              <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shadow-inner",
                formData.appointmentType === 'new' ? "border-medical-600 bg-medical-600" : "border-slate-300"
              )}>
                {formData.appointmentType === 'new' && <div className="w-2 h-2 bg-white rounded-full shadow-sm" />}
              </div>
              <div>
                <p className="font-bold text-slate-800 leading-none mb-1">New Consultation</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">First time visit</p>
              </div>
            </div>

            <div 
              onClick={() => setFormData(prev => ({ ...prev, appointmentType: 'followup' }))}
              className={cn(
                "p-5 rounded-3xl border-2 transition-all cursor-pointer flex items-center gap-4",
                formData.appointmentType === 'followup' 
                  ? "border-medical-500 bg-medical-50/50 shadow-lg shadow-medical-100/50" 
                  : "border-slate-100 bg-white hover:border-slate-200"
              )}
            >
              <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shadow-inner",
                formData.appointmentType === 'followup' ? "border-medical-600 bg-medical-600" : "border-slate-300"
              )}>
                {formData.appointmentType === 'followup' && <div className="w-2 h-2 bg-white rounded-full shadow-sm" />}
              </div>
              <div>
                <p className="font-bold text-slate-800 leading-none mb-1">Follow-Up (Recheck)</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Revisiting for the same issue</p>
              </div>
            </div>
          </div>

          {formData.appointmentType === 'followup' && (
            <div className="mt-6 p-6 bg-blue-50/30 rounded-[2rem] border border-blue-100/50 animate-in slide-in-from-top-4 duration-300">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest pl-1">
                  <Calendar className="w-3.5 h-3.5" /> Previous Visit Date *
                </div>
                <input
                  type="date"
                  name="previousVisitDate"
                  value={formData.previousVisitDate}
                  onChange={handleChange}
                  required={formData.appointmentType === 'followup'}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-6 py-4 bg-white border border-blue-100 rounded-2xl outline-none focus:ring-4 focus:ring-medical-500/10 focus:border-medical-500 transition-all font-semibold text-slate-900"
                />
                <p className="text-[10px] text-blue-500 font-bold tracking-tight">Select the date of your last consultation for this condition.</p>
              </div>
            </div>
          )}
        </div>

        {/* Doctor & Dept Selector */}
        <div className="pt-4 border-t border-slate-50">
          <DoctorSelector 
            onSelect={handleDoctorSelect}
            selectedDoctorId={formData.doctorId}
            selectedDepartment={formData.department}
          />
        </div>

        {/* Date & Time Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
              <Calendar className="w-3 h-3" /> Preferred Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-medical-500/10 focus:border-medical-500 transition-all font-semibold text-slate-900"
            />
          </div>
          
          <div className="md:col-span-1 hidden md:block" /> {/* Column offset */}

          <div className="md:col-span-2">
            <TimeSlotPicker 
              selectedDate={formData.date}
              selectedDoctorId={formData.doctorId}
              onSelect={handleSlotSelect}
              selectedSlotId={formData.slotId}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-5 rounded-2xl text-xl font-black transition-all flex items-center justify-center gap-4 ${
            isSubmitting
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-medical-600 text-white hover:bg-medical-700 shadow-xl shadow-medical-200 active:scale-[0.98]"
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-6 h-6 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
              Booking...
            </>
          ) : (
            <>
              Confirm Appointment
              <Send className="w-6 h-6" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
