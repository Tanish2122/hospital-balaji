"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Send, ExternalLink } from "lucide-react";
import Container from "../ui/Container";
import { supabase } from "@/lib/supabase";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
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
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone,
          email: formData.email,
          message: formData.message,
        },
      ]);

      if (error) throw error;

      setStatus("success");
      setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "" });
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setStatus("error");
      setErrorMessage(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-50 relative overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-2 gap-20 items-stretch">
          {/* Contact Details */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col"
          >
            <div className="inline-flex items-center gap-2 text-medical-600 font-bold text-xs uppercase tracking-widest mb-4">
              <span className="w-8 h-0.5 bg-medical-600"></span>
              Get In Touch
            </div>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-8 leading-tight">
              Contact <span className="text-gradient">Us</span>
            </h2>
            <p className="text-lg text-slate-600 mb-12 max-w-lg leading-relaxed">
              Have questions or need to schedule an appointment? Reach out to us through any of the following channels.
            </p>

            <div className="grid gap-6">
              <ContactInfoCard 
                icon={MapPin} 
                title="Address" 
                content="27, Ratan Nagar, Dher Ke Balaji, Sikar Road, Jaipur, RAJ. 302039"
                color="bg-medical-100 text-medical-600"
              />
              <ContactInfoCard 
                icon={Phone} 
                title="Phone" 
                content="Emergency: +91-72762-29049 | Appointment: +91-94621-34374"
                color="bg-emerald-100 text-emerald-600"
              />
              <ContactInfoCard 
                icon={Mail} 
                title="Email" 
                content="info@balajihospitaljaipur.com"
                color="bg-amber-100 text-amber-600"
              />
              <ContactInfoCard 
                icon={Clock} 
                title="Working Hours" 
                content="Emergency: 24/7 | OPD: 8:00 AM - 8:00 PM"
                color="bg-purple-100 text-purple-600"
              />
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-auto pt-12">
              {[
                { Icon: Facebook, href: "https://www.facebook.com/balajihospitaljaipur/", label: "Facebook" },
                { Icon: Instagram, href: "https://www.instagram.com/balajihospitaljaipur/", label: "Instagram" },
              ].map(({ Icon, href, label }) => (
                <a 
                  key={label} 
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${label}`}
                  className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-medical-600 hover:text-white hover:border-medical-600 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 min-w-[48px] min-h-[48px]"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[2.5rem] shadow-2xl shadow-medical-500/10 p-10 border border-slate-100 flex flex-col"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Send us a Message</h3>
            
            {status === "success" && (
              <div className="p-4 mb-6 text-sm text-green-800 rounded-lg bg-green-50">
                <span className="font-bold">Success!</span> Your message has been sent successfully. We will contact you soon.
              </div>
            )}
            {status === "error" && (
              <div className="p-4 mb-6 text-sm text-red-800 rounded-lg bg-red-50">
                <span className="font-bold">Error!</span> {errorMessage}
              </div>
            )}

            <form className="space-y-6 flex-1" onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contact-firstName" className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">First Name</label>
                  <input 
                    id="contact-firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    type="text" 
                    required 
                    className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:border-medical-500 focus:ring-4 focus:ring-medical-500/10 outline-none transition-all font-medium" 
                    placeholder="John" 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-lastName" className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Last Name</label>
                  <input 
                    id="contact-lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    type="text" 
                    required 
                    className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:border-medical-500 focus:ring-4 focus:ring-medical-500/10 outline-none transition-all font-medium" 
                    placeholder="Doe" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="contact-email" className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                <input 
                  id="contact-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email" 
                  required 
                  className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:border-medical-500 focus:ring-4 focus:ring-medical-500/10 outline-none transition-all font-medium" 
                  placeholder="john@example.com" 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="contact-phone" className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Phone Number</label>
                <input 
                  id="contact-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel" 
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:border-medical-500 focus:ring-4 focus:ring-medical-500/10 outline-none transition-all font-medium" 
                  placeholder="10-digit Phone Number" 
                />
                {formData.phone && formData.phone.length < 10 && (
                  <p className="text-[10px] text-red-500 font-bold ml-2">Must be exactly 10 digits</p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="contact-message" className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Message</label>
                <textarea 
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4} 
                  required 
                  className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:border-medical-500 focus:ring-4 focus:ring-medical-500/10 outline-none transition-all font-medium resize-none" 
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full bg-medical-600 text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-medical-500/20 active:scale-[0.98] group ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-medical-700"
                }`}
              >
                <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>

        {/* Mini Map Toggle/Directions */}
        <div className="mt-20 glass p-8 rounded-[2rem] border border-white/20 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-medical-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-medical-500/20">
              <MapPin className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900 leading-tight">Find us on Maps</h4>
              <p className="text-slate-600 font-medium">Located on Sirsi Road, Jaipur</p>
            </div>
          </div>
          <a 
            href="https://maps.google.com/?q=Balaji+Cure+Care+Hospital+Jaipur" 
            target="_blank" 
            className="bg-white hover:bg-slate-50 text-slate-900 px-10 py-5 rounded-2xl font-black flex items-center gap-3 transition-all border border-slate-200 shadow-sm"
          >
            Get Directions <ExternalLink className="w-5 h-5 text-medical-600" />
          </a>
        </div>
      </Container>
    </section>
  );
}

function ContactInfoCard({ icon: Icon, title, content, color }: any) {
  return (
    <div className="flex items-start gap-6 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm transition-all hover:shadow-xl group">
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h4 className="font-bold text-slate-900 mb-1">{title}</h4>
        <p className="text-sm text-slate-500 font-semibold leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
