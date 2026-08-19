"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Container from "../ui/Container";

const partners = [
  {
    name: "Aditya Birla Capital",
    logo: "/images/insurance/aditya-birla.svg",
    badge: "Insurance & Health",
    bg: "bg-gradient-to-br from-red-50/80 via-white to-amber-50/40 border-red-100",
  },
  {
    name: "SBI General Insurance",
    logo: "/images/insurance/sbi-general.svg",
    badge: "General Insurance",
    bg: "bg-gradient-to-br from-blue-50/80 via-white to-sky-50/40 border-blue-100",
  },
  {
    name: "Navi General Insurance",
    logo: "/images/insurance/navi.svg",
    badge: "Cashless Health",
    bg: "bg-gradient-to-br from-emerald-50/80 via-white to-green-50/40 border-emerald-100",
  },
  {
    name: "Family Health Plan TPA",
    logo: "/images/insurance/fhpl.svg",
    badge: "TPA Services",
    bg: "bg-gradient-to-br from-rose-50/80 via-white to-red-50/40 border-rose-100",
  },
  {
    name: "Future Generali",
    logo: "/images/insurance/future-generali.svg",
    badge: "Total Insurance",
    bg: "bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40 border-amber-100",
  },
  {
    name: "Niva Bupa (Max Bupa)",
    logo: "/images/insurance/niva-bupa.svg",
    badge: "Health Insurance",
    bg: "bg-gradient-to-br from-cyan-50/80 via-white to-blue-50/40 border-cyan-100",
  },
  {
    name: "RGHS / Chiranjivi Yojana",
    logo: "/images/insurance/rghs.svg",
    badge: "Rajasthan Govt Scheme",
    bg: "bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white border-blue-800 shadow-blue-900/20",
    isGovt: true,
  },
  {
    name: "United India Insurance",
    logo: "/images/insurance/united-india.svg",
    badge: "Public Sector PSU",
    bg: "bg-gradient-to-br from-sky-50/80 via-white to-indigo-50/40 border-sky-100",
  },
  {
    name: "Star Health & Allied",
    logo: "/images/insurance/star-health.svg",
    badge: "Specialist Health",
    bg: "bg-gradient-to-br from-blue-50/80 via-white to-blue-100/30 border-blue-100",
  },
];

export default function Insurance() {
  return (
    <section className="py-24 bg-slate-50/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-medical-100/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-100/30 rounded-full blur-[100px] pointer-events-none" />

      <Container className="relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-medical-600 font-bold text-xs uppercase tracking-widest mb-4">
            <span className="w-8 h-0.5 bg-medical-600" />
            Healthcare Benefits & Cashless Care
            <span className="w-8 h-0.5 bg-medical-600" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-6 font-poppins">
            Choose the Right <span className="text-gradient">Healthcare Benefit Scheme</span> for Treatment
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            We are partnered with leading national insurance companies, Govt. schemes, and TPAs to provide a seamless cashless treatment experience for all our patients.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`p-6 sm:p-8 rounded-[2.5rem] border shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col items-center justify-between group ${partner.bg}`}
            >
              <div className="w-full flex justify-between items-center mb-6">
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${partner.isGovt ? 'bg-amber-400 text-slate-950' : 'bg-slate-100/80 text-slate-600'}`}>
                  {partner.badge}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Logo Box */}
              <div className={`w-full h-24 sm:h-28 rounded-2xl flex items-center justify-center p-4 transition-transform duration-500 group-hover:scale-105 ${partner.isGovt ? 'bg-white/10 backdrop-blur-md' : 'bg-white shadow-inner'}`}>
                <Image
                  src={partner.logo}
                  alt={`${partner.name} Logo`}
                  width={220}
                  height={70}
                  className={`max-h-full max-w-full object-contain ${partner.isGovt ? 'brightness-0 invert' : ''}`}
                />
              </div>

              <div className="mt-6 text-center">
                <h3 className={`font-bold text-base sm:text-lg ${partner.isGovt ? 'text-white' : 'text-slate-900'} group-hover:text-medical-600 transition-colors`}>
                  {partner.name}
                </h3>
                <span className={`text-[11px] font-medium mt-1 block ${partner.isGovt ? 'text-blue-200' : 'text-slate-500'}`}>
                  Cashless Facility Available
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
