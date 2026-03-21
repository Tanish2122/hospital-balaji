"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      const { error } = await supabase.from("contact_forms").insert([
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email || null, // Optional field
          message: formData.message || null, // Optional field
        },
      ]);

      if (error) {
        throw error;
      }

      setStatus("success");
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setStatus("error");
      setErrorMessage(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
      {status === "success" && (
        <div className="md:col-span-2 p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50">
          <span className="font-medium">Success!</span> Your message has been sent successfully. We will contact you soon.
        </div>
      )}
      {status === "error" && (
        <div className="md:col-span-2 p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
          <span className="font-medium">Error!</span> {errorMessage}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-semibold text-slate-700">Your Name *</label>
        <input 
          type="text" 
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-medical-500 outline-none transition-all" 
          placeholder="Enter your name" 
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-semibold text-slate-700">Phone Number *</label>
        <input 
          type="tel" 
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          pattern="[0-9]{10}"
          maxLength={10}
          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-medical-500 outline-none transition-all" 
          placeholder="10-digit Number" 
        />
        {formData.phone && formData.phone.length < 10 && (
          <p className="text-[10px] text-red-500 font-bold ml-2">Must be exactly 10 digits</p>
        )}
      </div>
      <div className="space-y-2 md:col-span-2">
        <label htmlFor="email" className="text-sm font-semibold text-slate-700">Your Email (Optional)</label>
        <input 
          type="email" 
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-medical-500 outline-none transition-all" 
          placeholder="email@example.com" 
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <label htmlFor="message" className="text-sm font-semibold text-slate-700">Your Message (Optional)</label>
        <textarea 
          id="message"
          name="message"
          rows={4} 
          value={formData.message}
          onChange={handleChange}
          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-medical-500 outline-none transition-all" 
          placeholder="How can we help you?"
        ></textarea>
      </div>
      <div className="md:col-span-2">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`w-full md:w-auto px-10 py-4 bg-medical-600 text-white rounded-2xl font-bold transition-colors shadow-lg shadow-medical-200 ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-medical-700"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit Message"}
        </button>
      </div>
    </form>
  );
}
