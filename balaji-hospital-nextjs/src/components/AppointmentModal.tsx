"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, User, Phone, Mail, FileText, Send, Stethoscope, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

const DEPARTMENTS = ["Orthopedic", "ENT", "Other"];

interface Doctor {
  id: string;
  name: string;
  on_leave: boolean;
}

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
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
  });
  
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const { data, error } = await supabase
          .from("doctors")
          .select("id, name, on_leave, departments(name)")
          .eq("is_active", true)
          .eq("on_leave", false); // Filter out doctors on leave

        if (error) throw error;

        if (data) {
          const filtered = data.filter((d: any) => d.departments?.name === formData.department);
          setDoctors(filtered);
          if (filtered.length > 0) {
            setFormData(prev => ({ ...prev, doctorId: filtered[0].id }));
          } else {
            setFormData(prev => ({ ...prev, doctorId: "" }));
          }
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, [formData.department, isOpen]);

  useEffect(() => {
    if (!formData.appointmentDate || !formData.doctorId) {
      setAvailableSlots([]);
      return;
    }

    const fetchSlots = async () => {
      try {
        const date = new Date(formData.appointmentDate);
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayName = dayNames[date.getDay()];
        
        // 1. Check for specific date leaves
        const { data: specificDates } = await supabase
          .from("availability")
          .select("*")
          .eq("doctor_id", formData.doctorId)
          .eq("day_of_week", "SpecificDate")
          .eq("specific_date", formData.appointmentDate);

        if (specificDates && specificDates.some(d => !d.is_available)) {
          setAvailableSlots([]);
          return;
        }

        // 2. Fetch weekly recurring slots
        const { data: weeklySlots } = await supabase
          .from("availability")
          .select("*")
          .eq("doctor_id", formData.doctorId)
          .eq("day_of_week", dayName)
          .eq("is_available", true);

        let finalSlots: string[] = [];

        if (weeklySlots && weeklySlots.length > 0) {
          // Generate slots from individual ranges
          weeklySlots.forEach(slot => {
            const startHour = parseInt(slot.start_time.split(':')[0]);
            const endHour = parseInt(slot.end_time.split(':')[0]);
            
            for (let h = startHour; h <= endHour; h++) {
              const hour = h % 24;
              const ampm = hour >= 12 ? "PM" : "AM";
              const h12 = hour % 12 || 12;
              finalSlots.push(`${h12.toString().padStart(2, '0')}:00 ${ampm}`);
            }
          });
          // Sort unique slots
          finalSlots = Array.from(new Set(finalSlots)).sort((a, b) => {
            const timeA = new Date(`2000/01/01 ${a}`).getTime();
            const timeB = new Date(`2000/01/01 ${b}`).getTime();
            return timeA - timeB;
          });
        } else {
          // FALLBACK to default rules if no database entries found
          const day = date.getDay();
          const slots = ["10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM"];
          if (day !== 0) {
            slots.push("06:00 PM", "07:00 PM", "08:00 PM");
          }
          finalSlots = slots;
        }

        setAvailableSlots(finalSlots);
        if (finalSlots.length > 0) {
          setFormData(prev => ({ ...prev, appointmentTime: finalSlots[0] }));
        } else {
          setFormData(prev => ({ ...prev, appointmentTime: "" }));
        }
      } catch (err) {
        console.error("Error generating slots:", err);
      }
    };

    fetchSlots();
  }, [formData.appointmentDate, formData.doctorId]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
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
      const response = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "non-emergency",
          patientName: formData.patientName,
          phone: formData.phone,
          email: formData.email,
          department: formData.department,
          doctorId: formData.doctorId,
          date: formData.appointmentDate,
          slotId: formData.appointmentTime,
          reason: formData.reason,
        }),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error || "Failed to book appointment");

      setStatus("success");
      setFormData({
        patientName: "",
        phone: "",
        email: "",
        department: defaultDepartment,
        doctorId: "",
        appointmentDate: "",
        appointmentTime: "",
        reason: "",
      });
      
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
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        <div className="sticky top-0 bg-white/90 backdrop-blur-md px-8 py-6 border-b border-slate-100 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-poppins">Book an Appointment</h2>
            <p className="text-slate-500 text-sm mt-1">Schedule a consultation with our specialists</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          {status === "success" && (
            <div className="p-4 mb-6 text-sm text-green-800 rounded-2xl bg-green-50 border border-green-100 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 shrink-0">✓</span>
              <div>
                <span className="font-bold block">Appointment Request Sent!</span> 
                Our team will contact you shortly to confirm.
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
                <input type="text" name="patientName" value={formData.patientName} onChange={handleChange} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 transition-all font-medium text-slate-900" placeholder="Full Name" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                  <Phone className="w-3 h-3" /> Phone Number *
                </label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required pattern="[0-9]{10}" maxLength={10} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 transition-all font-medium text-slate-900" placeholder="10-digit Phone" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                  <Stethoscope className="w-3 h-3" /> Department
                </label>
                <select name="department" value={formData.department} onChange={handleChange} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 transition-all font-medium text-slate-900 font-poppins">
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                  <User className="w-3 h-3" /> Select Doctor
                </label>
                <select name="doctorId" value={formData.doctorId} onChange={handleChange} disabled={loadingDoctors || doctors.length === 0} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 transition-all font-medium text-slate-900 disabled:opacity-50">
                  {doctors.length === 0 ? <option value="">No doctors available</option> : doctors.map((doc) => <option key={doc.id} value={doc.id}>{doc.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                  <Calendar className="w-3 h-3" /> Preferred Date *
                </label>
                <input type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 transition-all font-medium text-slate-900" min={new Date().toISOString().split('T')[0]} />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                  <Clock className="w-3 h-3" /> Preferred Time Slot *
                </label>
                <select name="appointmentTime" value={formData.appointmentTime} onChange={handleChange} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 transition-all font-medium text-slate-900 disabled:opacity-50" disabled={!formData.appointmentDate}>
                  {availableSlots.length === 0 ? <option value="">Select date first</option> : availableSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                <FileText className="w-3 h-3" /> Reason for Visit
              </label>
              <textarea rows={3} name="reason" value={formData.reason} onChange={handleChange} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 transition-all font-medium text-slate-900 resize-none" placeholder="Briefly describe your symptoms" />
            </div>

            <button type="submit" disabled={isSubmitting} className={`w-full bg-medical-600 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-medical-500/20 ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-medical-700 active:scale-[0.98]"}`}>
              <span>{isSubmitting ? "Submitting..." : "Confirm Appointment"}</span>
              {!isSubmitting && <Send className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
