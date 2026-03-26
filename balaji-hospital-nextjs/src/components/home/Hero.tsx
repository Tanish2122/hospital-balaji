"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import Container from "../ui/Container";

const AppointmentModal = dynamic(() => import("../AppointmentModal"), { ssr: false });

export default function Hero() {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden bg-slate-50 py-24 sm:py-32 lg:py-20">
        {/* Background blobs for depth */}
        <div className="blob bg-medical-200 w-[500px] h-[500px] -top-24 -left-24 rounded-full mix-blend-multiply opacity-20"></div>
        <div className="blob bg-emerald-200 w-[400px] h-[400px] -bottom-24 -right-24 rounded-full mix-blend-multiply opacity-20 animation-delay-2000"></div>

        <Container className="relative z-10 pt-12 lg:pt-0">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
            {/* Left Content (Text Block) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-1/2 space-y-6 mb-0"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-medical-100/50 border border-medical-200 text-medical-700 font-bold text-xs uppercase tracking-widest">
                <span className="w-2 h-2 bg-medical-600 rounded-full animate-pulse"></span>
                Established in 1996 — Jaipur''s Trusted Choice
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display font-bold text-slate-900 leading-[1.15] lg:leading-[1.1]">
                {"The name you know."}<br className="hidden sm:block" />
                <span className="text-gradient">{"The doctors you trust."}</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Balaji Hospital & Orthopaedic Centre was inaugurated in 1996 with a motive of providing
                best and affordable healthcare. Complete in-house treatment for Orthopedic and ENT care.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Link
                  href="/appointment"
                  className="w-full sm:w-auto bg-medical-600 hover:bg-medical-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-xl shadow-medical-500/20 group text-decoration-none"
                >
                  Book Appointment <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="tel:+917276229049" className="w-full sm:w-auto bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all hover:border-medical-500">
                  <Phone className="w-5 h-5 text-medical-600" /> +91 7276229049
                </a>
              </div>


            </motion.div>

            {/* Right Child (Image Block) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="w-full lg:w-1/2 relative mt-8 lg:mt-12"
            >
              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-medical-500/10">
                <Image
                  src="/images/gallery/main building .png"
                  alt="Balaji Hospital Jaipur"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={85}
                />
                {/* Overlay content */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>

                {/* Surgery Count Floating Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="absolute top-8 right-8 glass p-4 rounded-2xl border border-white/30 backdrop-blur-xl shadow-2xl hidden md:block"
                >
                  <div className="text-2xl font-black text-medical-600">50,000+</div>
                  <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-tight">Successful <br />Surgeries</div>
                </motion.div>

                {/* Floating Emergency Card */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-8 left-8 right-8 glass p-6 rounded-3xl border border-white/20 shadow-2xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white shrink-0">
                      <Phone className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 leading-tight">Emergency Assistance</h4>
                      <p className="text-sm text-slate-600 font-semibold tracking-wide">Available 24/7 for you</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Decorative dots/shapes */}
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-medical-200/30 rounded-full blur-3xl -z-10"></div>
            </motion.div>
          </div>
        </Container>
      </section>

      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
      />
    </>
  );
}
