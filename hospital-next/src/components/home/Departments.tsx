"use client";

import { motion } from "framer-motion";
import Container from "../ui/Container";
import Link from "next/link";
import { services } from "@/data/services";
import { CheckCircle2, Bone, Stethoscope, Microscope, Wind, Activity, Flame, ChevronDown, ArrowRight } from "lucide-react";

const getIcon = (id: string) => {
  switch (id) {
    case 'spine-treatment': return Bone;
    case 'knee-replacement': return Activity;
    case 'hip-replacement': return Activity;
    case 'fracture-treatment': return Bone;
    case 'ear-surgery': return Microscope;
    case 'nose-surgery': return Wind;
    case 'throat-surgery': return Wind;
    case 'kidney-stones': return Flame;
    default: return Stethoscope;
  }
};

const getColor = (category: string) => {
  switch (category) {
    case 'Orthopedic': return "bg-amber-100 text-amber-600";
    case 'ENT': return "bg-blue-100 text-blue-600";
    case 'Speciality': return "bg-purple-100 text-purple-600";
    default: return "bg-slate-100 text-slate-600";
  }
};

export default function Departments() {
  return (
    <section id="departments" className="py-24 bg-white relative overflow-hidden">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-medical-600 font-bold text-xs uppercase tracking-widest mb-4">
            <span className="w-8 h-0.5 bg-medical-600"></span>
            Our Specialties
            <span className="w-8 h-0.5 bg-medical-600"></span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-6 underline decoration-medical-100 decoration-8 underline-offset-4">
            Centers of <span className="text-gradient">Excellence</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Comprehensive medical care across 15+ specialties with state-of-the-art equipment and experienced specialists.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.slice(0, 6).map((service, index) => {
            const Icon = getIcon(service.id);
            const color = getColor(service.category);
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-medical-500 hover:bg-white transition-all duration-300 hover:shadow-2xl hover:shadow-medical-500/10 cursor-pointer"
              >
                <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-sm`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-medical-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed line-clamp-3">
                  {service.description}
                </p>
                <Link href={service.url} className="flex items-center text-medical-600 font-bold text-sm group-hover:gap-2 transition-all">
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -ml-2 group-hover:ml-0" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <button className="inline-flex items-center gap-2 text-medical-600 font-bold hover:text-medical-700 transition-all hover:gap-3">
            <span>View All Departments</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </button>
        </div>
      </Container>
    </section>
  );
}
