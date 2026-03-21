"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import Container from "../ui/Container";

const doctors = [
  {
    name: "Dr. Abhishek Soni",
    qualifications: "MBBS, MD Radiodiagnosis",
    specialty: "Radiology & Imaging Specialist",
    experience: "15+ Years",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop",
  },
  {
    name: "Dr. Priya Sharma",
    qualifications: "MBBS, MD, DM Cardiology",
    specialty: "Interventional Cardiologist",
    experience: "12+ Years",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop",
  },
  {
    name: "Dr. Rajesh Kumar",
    qualifications: "MBBS, MS Orthopedics",
    specialty: "Joint Replacement Surgeon",
    experience: "20+ Years",
    rating: "5.0",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop",
  },
  {
    name: "Dr. Sunita Patel",
    qualifications: "MBBS, MD, DNB Oncology",
    specialty: "Medical Oncologist",
    experience: "10+ Years",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&auto=format&fit=crop",
  },
];

export default function Doctors() {
  return (
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
          {doctors.map((doctor, index) => (
            <motion.div
              key={doctor.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-slate-800/40 backdrop-blur-md rounded-3xl overflow-hidden border border-slate-700/50 hover:border-medical-500/50 transition-all duration-500 hover:-translate-y-3"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image 
                  src={doctor.image} 
                  alt={doctor.name} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                
                {/* Years of Experience Badge */}
                <div className="absolute top-4 right-4 bg-medical-600/90 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/20">
                  {doctor.experience}
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-medical-400 transition-colors">
                  {doctor.name}
                </h3>
                <p className="text-medical-400 text-xs font-bold uppercase tracking-wider mb-4">
                  {doctor.qualifications}
                </p>
                <p className="text-slate-400 text-sm mb-6 font-medium">
                  {doctor.specialty}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-black">{doctor.rating}</span>
                  </div>
                  <button className="text-sm font-bold text-medical-400 hover:text-medical-300 transition-colors flex items-center gap-2 group/btn">
                    Book Now <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl border border-slate-700 hover:border-medical-500 hover:bg-medical-600/10 transition-all text-white font-bold group">
            <span>View All Doctors</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </Container>
    </section>
  );
}
