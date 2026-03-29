"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Star, ArrowRight, Loader2 } from "lucide-react";
import Container from "../ui/Container";
import { supabase } from "@/lib/supabase";

const AppointmentModal = dynamic(() => import("../AppointmentModal"), { ssr: false });

interface Doctor {
  id: string;
  name: string;
  image_url: string;
  experience_years: number;
  qualification: string;
  designation: string;
  specialization: string;
  slug: string;
}

export default function Doctors() {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDoctors() {
      const { data, error } = await supabase
        .from('doctors')
        .select(`
          id, 
          name, 
          image_url, 
          experience_years, 
          qualification, 
          designation, 
          specialization,
          slug,
          status
        `)
        .eq('status', 'active');

      if (!error && data) {
        // Implement "one of each department" logic
        const departmentMap = new Map<string, Doctor>();
        
        data.forEach(doc => {
          const dept = doc.specialization || "General";
          if (!departmentMap.has(dept)) {
            departmentMap.set(dept, {
              id: doc.id,
              name: doc.name,
              image_url: doc.image_url,
              experience_years: doc.experience_years || 0,
              qualification: doc.qualification?.split(',')[0] || "",
              designation: doc.designation || doc.specialization,
              specialization: doc.specialization,
              slug: doc.slug || doc.id
            });
          }
        });

        // Convert map to array and take top 4
        setDoctors(Array.from(departmentMap.values()).slice(0, 4));
      }
      setLoading(false);
    }
    fetchDoctors();
  }, []);

  return (
    <>
      <section id="doctors" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-medical-900/50 via-slate-900 to-slate-900"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-medical-500 to-transparent opacity-50"></div>

      <Container className="relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 px-4">
          <div className="inline-flex items-center gap-2 text-medical-400 font-bold text-xs uppercase tracking-widest mb-4">
            <span className="w-8 h-0.5 bg-medical-400"></span>
            Expert Medical Team
            <span className="w-8 h-0.5 bg-medical-400"></span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6 font-poppins">
            Meet Our <span className="text-medical-400">Specialists</span>
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed sm:px-4 italic opacity-80">
            Our team of experienced doctors and surgeons are dedicated to providing personalized medical care using the latest advancements.
          </p>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center bg-slate-800/20 rounded-[3rem] border border-dashed border-slate-700">
             <Loader2 className="w-10 h-10 animate-spin text-medical-500 mb-4" />
             <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Assembling Team...</p>
          </div>
        ) : doctors.length === 0 ? (
          <div className="py-20 text-center bg-slate-800/20 rounded-[3rem] border border-dashed border-slate-700">
             <p className="text-slate-500 italic">Our specialists are currently unavailable. Please check back later.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {doctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-slate-800/40 backdrop-blur-md rounded-3xl overflow-hidden border border-slate-700/50 hover:border-medical-500/50 transition-all duration-500 hover:-translate-y-3"
              >
                <Link href={`/doctors/${doctor.slug}`} className="block relative aspect-[4/5] overflow-hidden">
                  <Image 
                    src={doctor.image_url || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop"} 
                    alt={doctor.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                  
                  {/* Years of Experience Badge */}
                  <div className="absolute top-4 right-4 bg-medical-600/90 backdrop-blur-md text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/20">
                    {doctor.experience_years}+ Years
                  </div>
                </Link>

                <div className="p-8">
                  <Link href={`/doctors/${doctor.slug}`} className="block">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-medical-400 transition-colors font-poppins">
                      {doctor.name}
                    </h3>
                  </Link>
                  <p className="text-medical-400 text-xs font-bold uppercase tracking-wider mb-4 line-clamp-1">
                    {doctor.qualification}
                  </p>
                  <p className="text-slate-400 text-sm mb-6 font-medium line-clamp-1 italic">
                    {doctor.designation}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                    <div className="flex items-center gap-1.5 text-amber-500">
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
        )}

        <div className="text-center mt-16">
          <Link 
            href="/doctors"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl border border-slate-700 hover:border-medical-500 hover:bg-medical-600/10 transition-all text-white font-bold group bg-slate-900/40 shadow-xl"
          >
            <span className="uppercase tracking-[0.2em] text-xs">View All Doctors</span>
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

