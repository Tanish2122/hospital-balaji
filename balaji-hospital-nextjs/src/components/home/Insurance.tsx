"use client";

import { motion } from "framer-motion";
import Container from "../ui/Container";

const partners = [
  { name: "Aditya Birla Capital", color: "bg-medical-100 text-medical-800" },
  { name: "SBI General Insurance", color: "bg-blue-100 text-blue-800" },
  { name: "Navi General Insurance", color: "bg-emerald-100 text-emerald-800" },
  { name: "Family Health Plan TPA", color: "bg-rose-100 text-rose-800" },
  { name: "Future Generali", color: "bg-amber-100 text-amber-800" },
  { name: "Niva Bupa (Max Bupa)", color: "bg-medical-100 text-medical-800" },
  { name: "RGHS / Chiranjivi Yojana", color: "bg-medical-700 text-white" },
  { name: "United India Insurance", color: "bg-blue-100 text-blue-800" },
  { name: "Star Health & Allied", color: "bg-medical-100 text-medical-800" },
];

export default function Insurance() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/4 h-1/4 bg-medical-50 rounded-full blur-[100px] opacity-30" />
      
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-medical-600 font-bold text-xs uppercase tracking-widest mb-4">
            <span className="w-8 h-0.5 bg-medical-600" />
            Healthcare Benefits
            <span className="w-8 h-0.5 bg-medical-600" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-6">
            Choose the Right <span className="text-gradient">Healthcare Benefit Scheme</span> for Treatment
          </h2>
          <p className="text-slate-600 text-lg">
            We are partnered with leading insurance companies and TPAs to provide a seamless cashless treatment experience for our patients.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className={`${partner.color} p-4 sm:p-8 rounded-3xl sm:rounded-[2.5rem] flex items-center justify-center text-center font-black text-[10px] sm:text-xs uppercase tracking-wider h-24 sm:h-32 border border-slate-100 shadow-sm group hover:shadow-xl transition-all duration-500`}
            >
              <span className="group-hover:scale-110 transition-transform">{partner.name}</span>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
