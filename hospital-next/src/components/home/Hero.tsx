"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Phone, ShieldCheck, Award, Users } from "lucide-react";
import Container from "../ui/Container";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen pt-32 pb-20 flex items-center overflow-hidden bg-slate-50">
      {/* Background blobs for depth */}
      <div className="blob bg-medical-200 w-[500px] h-[500px] -top-24 -left-24 rounded-full mix-blend-multiply opacity-20"></div>
      <div className="blob bg-emerald-200 w-[400px] h-[400px] -bottom-24 -right-24 rounded-full mix-blend-multiply opacity-20 animation-delay-2000"></div>

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-medical-100/50 border border-medical-200 text-medical-700 font-bold text-xs uppercase tracking-widest">
              <span className="w-2 h-2 bg-medical-600 rounded-full animate-pulse"></span>
              Serving Jaipur Since 1996
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-display font-bold text-slate-900 leading-[1.1]">
              The name you know. <br />
              <span className="text-gradient">The doctors you trust.</span>
            </h1>
            
            <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
              Balaji Hospital was inaugurated in 1996 with a motive of providing 
              best and affordable healthcare to all sections of the society. 
              Complete in-house treatment for orthopedic and ENT care.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/contact" className="bg-medical-600 hover:bg-medical-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all hover:scale-105 shadow-xl shadow-medical-500/20 group text-decoration-none">
                Book Appointment <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="tel:+917276229049" className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all hover:border-medical-500">
                <Phone className="w-5 h-5 text-medical-600" /> +91 7276229049
              </a>
            </div>

            {/* Quick Stats/Trust badges */}
            <div className="grid grid-cols-3 gap-6 pt-12 border-t border-slate-200">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-medical-600 font-bold">
                  <ShieldCheck className="w-5 h-5" /> 100%
                </div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-tighter">In-house Care</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-600 font-bold">
                  <Award className="w-5 h-5" /> 28+
                </div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-tighter">Years Experience</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-amber-600 font-bold">
                  <Users className="w-5 h-5" /> 50K+
                </div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-tighter">Patients Treated</p>
              </div>
            </div>
          </motion.div>

          {/* Right Image/Graphic */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-medical-500/10">
              <Image 
                src="/images/gallery/reception.png" 
                alt="Balaji Hospital Jaipur Reception" 
                fill 
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Overlay content */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
              
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
  );
}
