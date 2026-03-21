"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Ambulance, Microscope, ShieldCheck, FlaskConical, CheckCircle } from "lucide-react";
import Container from "../ui/Container";

const features = [
  {
    title: "Modern Operation Theatres",
    description: "Fully sterilised OTs equipped for orthopaedic, ENT & speciality surgeries",
    icon: Ambulance,
    color: "bg-medical-100 text-medical-600",
    hoverColor: "group-hover:bg-medical-600",
  },
  {
    title: "Digital X-Ray & Imaging",
    description: "State-of-the-art digital radiology for accurate and fast diagnostics",
    icon: Microscope,
    color: "bg-amber-100 text-amber-600",
    hoverColor: "group-hover:bg-amber-500",
  },
  {
    title: "Physiotherapy Centre",
    description: "Fully equipped rehabilitation unit with experienced physiotherapists",
    icon: ShieldCheck,
    color: "bg-emerald-100 text-emerald-600",
    hoverColor: "group-hover:bg-emerald-500",
  },
  {
    title: "24/7 In-house Pharmacy",
    description: "Round-the-clock medical store stocked with authentic medicines",
    icon: FlaskConical,
    color: "bg-blue-100 text-blue-600",
    hoverColor: "group-hover:bg-blue-500",
  },
];

export default function Facilities() {
  return (
    <section id="facilities" className="py-24 relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-medical-50/50" />

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Side: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 text-medical-600 font-bold text-xs uppercase tracking-widest">
              <span className="w-8 h-0.5 bg-medical-600" />
              World-Class Infrastructure
            </div>

            <h2 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 leading-tight">
              Advanced Facilities for <br />
              <span className="text-gradient">Better Care</span>
            </h2>

            <p className="text-lg text-slate-600 leading-relaxed">
              Balaji Hospital is equipped with the latest medical technology and comfortable
              amenities to deliver superior outcomes. Our 100+ bed facility spans modern operation
              theatres, physiotherapy, diagnostics, and round-the-clock pharmacy — all under one roof.
            </p>

            <div className="grid gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-6 p-6 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-medical-200 transition-all cursor-pointer group"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center ${feature.hoverColor} group-hover:text-white transition-all duration-300 shadow-sm`}
                  >
                    <feature.icon className="w-7 h-7 transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 text-lg mb-0.5">{feature.title}</h4>
                    <p className="text-sm text-slate-500 font-medium">{feature.description}</p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side: Real Hospital Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6 pt-12">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="relative aspect-square rounded-[2rem] overflow-hidden shadow-2xl group"
                >
                  <Image
                    src="https://balajihospitaljaipur.com/uploads/gallery/5729652157ot-small.png"
                    alt="Balaji Hospital Operation Theatre"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl group"
                >
                  <Image
                    src="https://balajihospitaljaipur.com/uploads/gallery/6229751557physiotherapy-small.png"
                    alt="Balaji Hospital Physiotherapy Centre"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                </motion.div>
              </div>
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl group"
                >
                  <Image
                    src="https://balajihospitaljaipur.com/uploads/gallery/5965221775reception1-small.png"
                    alt="Balaji Hospital Reception Area"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="relative aspect-square rounded-[2rem] overflow-hidden shadow-2xl group"
                >
                  <Image
                    src="https://balajihospitaljaipur.com/uploads/gallery/2956725571digitalXray-small.png"
                    alt="Balaji Hospital Digital X-Ray"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                </motion.div>
              </div>
            </div>

            {/* Floating Stats Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 glass px-10 py-7 rounded-[2rem] border border-white/20 shadow-2xl flex items-center gap-10"
            >
              <div className="text-center">
                <span className="block text-3xl font-black text-medical-600">24/7</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                  Emergency
                </span>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div className="text-center">
                <span className="block text-3xl font-black text-emerald-600">100+</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                  Beds
                </span>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div className="text-center">
                <span className="block text-3xl font-black text-amber-600">28+</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                  Years
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
