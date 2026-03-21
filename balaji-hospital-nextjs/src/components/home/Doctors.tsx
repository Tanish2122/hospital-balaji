"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import Container from "../ui/Container";

const AppointmentModal = dynamic(() => import("../AppointmentModal"), { ssr: false });
import { doctors as localDoctors } from "@/data/doctors";

// Map local doctor data to match the UI field names
const doctorsList = localDoctors.slice(0, 4).map((d) => ({
  id: d.id,
  name: d.name,
  image_url: d.image,
  experience_years: parseInt(d.experience.replace(/[^0-9]/g, "")) || 0,
  qualification: d.qualifications[0] || "",
  designation: d.specialty,
}));

export default function Doctors() {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  return (
    <>
      <section id="doctors" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-medical-900/50 via-slate-900 to-slate-900"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-medical-500 to-transparent"></div>

      <Container className="relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-medical-400 font-bold text-xs uppercase tracking-widest mb-4">
            <span className="w-8 h-0.5 bg-medical-400"></span>
            Expert Medical Team
            <span className="w-8 h-0.5 bg-medical-400"></span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
            Meet Our <span className="text-gradient">Specialists</span>
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            Our team of experienced doctors and surgeons are dedicated to providing personalized, compassionate care using the latest medical advancements.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctorsList.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-slate-800/40 backdrop-blur-md rounded-3xl overflow-hidden border border-slate-700/50 hover:border-medical-500/50 transition-all duration-500 hover:-translate-y-3"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image 
                  src={doctor.image_url || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop"} 
                  alt={doctor.name} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                
                {/* Years of Experience Badge */}
                <div className="absolute top-4 right-4 bg-medical-600/90 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/20">
                  {doctor.experience_years}+ Years
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-medical-400 transition-colors">
                  {doctor.name}
                </h3>
                <p className="text-medical-400 text-xs font-bold uppercase tracking-wider mb-4 line-clamp-1">
                  {doctor.qualification}
                </p>
                <p className="text-slate-400 text-sm mb-6 font-medium line-clamp-1">
                  {doctor.designation}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-black">4.9</span>
                  </div>
                  <button 
                    onClick={() => setIsAppointmentModalOpen(true)}
                    className="text-sm font-bold text-medical-400 hover:text-medical-300 transition-colors flex items-center gap-2 group/btn"
                  >
                    Book Now <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link 
            href="/doctors"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl border border-slate-700 hover:border-medical-500 hover:bg-medical-600/10 transition-all text-white font-bold group"
          >
            <span>View All Doctors</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
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
