"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Linkedin, Send, ExternalLink } from "lucide-react";
import Container from "../ui/Container";

export default function Contact() {
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
                content="Kanak Vihar, Sirsi Road, Jaipur, Rajasthan 302034"
                color="bg-medical-100 text-medical-600"
              />
              <ContactInfoCard 
                icon={Phone} 
                title="Phone" 
                content="Emergency: +91-94621-34373 | Appointment: +91-94621-34374"
                color="bg-emerald-100 text-emerald-600"
              />
              <ContactInfoCard 
                icon={Mail} 
                title="Email" 
                content="helpdesk@balajihospitals.co.in"
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
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-medical-600 hover:text-white hover:border-medical-600 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1"
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
            <form className="space-y-6 flex-1">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">First Name</label>
                  <input type="text" required className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:border-medical-500 focus:ring-4 focus:ring-medical-500/10 outline-none transition-all font-medium" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Last Name</label>
                  <input type="text" required className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:border-medical-500 focus:ring-4 focus:ring-medical-500/10 outline-none transition-all font-medium" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                <input type="email" required className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:border-medical-500 focus:ring-4 focus:ring-medical-500/10 outline-none transition-all font-medium" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Phone Number</label>
                <input type="tel" required className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:border-medical-500 focus:ring-4 focus:ring-medical-500/10 outline-none transition-all font-medium" placeholder="+91 98765 43210" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Message</label>
                <textarea rows={4} required className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:border-medical-500 focus:ring-4 focus:ring-medical-500/10 outline-none transition-all font-medium resize-none" placeholder="How can we help you?"></textarea>
              </div>
              <button type="submit" className="w-full bg-medical-600 hover:bg-medical-700 text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-medical-500/20 active:scale-[0.98] group">
                <span>Send Message</span>
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
