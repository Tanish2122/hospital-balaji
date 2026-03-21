"use client";

import React, { useState, useRef } from "react";
import { AlertCircle, Upload, X, FileText, Phone, User, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function EmergencyForm() {
  const [formData, setFormData] = useState({
    patientName: "",
    phone: "",
    whatsapp: "",
    description: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Strict phone/whatsapp validation: only digits, max 10
    if (name === "phone" || name === "whatsapp") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
      return;
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Basic validation
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowedTypes.includes(selectedFile.type) && !selectedFile.name.toLowerCase().endsWith('.mri') && !selectedFile.name.toLowerCase().endsWith('.xray')) {
        alert("Please upload a PDF or an Image (JPG, PNG).");
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");
    
    try {
      let reportUrl: string | null = null;

      // 1. Upload File (if present)
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `${fileName}`; // Upload to root of reports bucket

        const { error: uploadError } = await supabase.storage
          .from('reports') // Bucket name updated to 'reports'
          .upload(filePath, file);

        if (uploadError) {
          console.error("Upload error details:", uploadError);
          // If upload fails, we notify the user instead of proceeding blindly
          setErrorMessage(`File upload failed: ${uploadError.message}. Please try again.`);
          setStatus("error");
          setIsSubmitting(false);
          return;
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('reports')
            .getPublicUrl(filePath);
          reportUrl = publicUrl;
        }
      }

      // 2. Call API for processing & WhatsApp
      const response = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "emergency",
          patientName: formData.patientName,
          phone: formData.phone,
          whatsapp: formData.whatsapp,
          description: formData.description,
          reportUrl: reportUrl,
        }),
      });

      const result = await response.json();

      if (!result.success) throw new Error(result.error || "Failed to process request");

      setStatus("success");
      setFormData({ patientName: "", phone: "", whatsapp: "", description: "" });
      setFile(null);
    } catch (error: any) {
      console.error("Error submitting emergency request:", error);
      setStatus("error");
      setErrorMessage(error.message || "Something went wrong. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "success") {
    return (
      <div className="bg-red-50 border-2 border-red-100 rounded-[2.5rem] p-12 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-red-200">
          <AlertCircle className="w-10 h-10 animate-pulse" />
        </div>
        <h3 className="text-3xl font-bold text-slate-900 mb-4 font-poppins">Emergency Request Sent!</h3>
        <p className="text-red-700 text-lg max-w-md mx-auto leading-relaxed font-medium">
          Your emergency request has been received. Our medical team will contact you **immediately** on the provided number.
        </p>
        <button 
          onClick={() => setStatus("idle")}
          className="mt-10 text-red-600 font-bold hover:underline"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-2xl shadow-slate-100 relative overflow-hidden">
      {/* Decorative indicator */}
      <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
      
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-poppins">Emergency Assistance</h2>
          <p className="text-slate-500 text-sm">Please provide accurate details for prompt response</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
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
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-semibold text-slate-900"
              placeholder="Full Name"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
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
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-semibold text-slate-900"
              placeholder="10-digit Number"
            />
            {formData.phone && formData.phone.length < 10 && (
              <p className="text-[10px] text-red-500 font-bold ml-2">Must be exactly 10 digits</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
              <MessageSquare className="w-3 h-3" /> WhatsApp Number (Optional)
            </label>
            <input
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-semibold text-slate-900"
              placeholder="Same as phone or different"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
              <Upload className="w-3 h-3" /> Medical Reports (Optional)
            </label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`w-full px-6 py-3 border-2 border-dashed rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                file ? "border-red-500 bg-red-50" : "border-slate-200 bg-slate-50 hover:border-red-300"
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText className={`w-5 h-5 shrink-0 ${file ? "text-red-500" : "text-slate-400"}`} />
                <span className={`text-sm font-semibold truncate ${file ? "text-red-700" : "text-slate-400"}`}>
                  {file ? file.name : "Snap of MRI/X-ray or PDF"}
                </span>
              </div>
              {file ? (
                <button 
                  type="button" 
                  onClick={(e) => { e.stopPropagation(); removeFile(); }}
                  className="p-1.5 hover:bg-red-200 rounded-lg text-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <span className="text-xs font-bold text-red-500 shrink-0">UPLOAD</span>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden" 
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
            <FileText className="w-3 h-3" /> Description of Emergency *
          </label>
          <textarea
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-semibold text-slate-900 resize-none h-40"
            placeholder="Please briefly describe the condition (e.g., severe pain, accident, difficulty breathing)..."
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-5 rounded-2xl text-xl font-black transition-all flex items-center justify-center gap-4 ${
            isSubmitting
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-200 active:scale-[0.98]"
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-6 h-6 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Request Immediate Assistance
              <AlertCircle className="w-6 h-6" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
