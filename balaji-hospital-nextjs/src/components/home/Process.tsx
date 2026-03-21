"use client";

import { motion } from "framer-motion";
import { CalendarCheck, ClipboardList, Stethoscope, UserRoundCheck } from "lucide-react";
import Container from "../ui/Container";

const steps = [
  {
    icon: CalendarCheck,
    title: "Schedule an appointment",
    description: "The first step to getting the best treatment is to schedule an appointment with us. Contact our friendly staff to book a convenient time.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: UserRoundCheck,
    title: "Consultation with our specialists",
    description: "Once scheduled, you will meet with our expert doctors for a thorough examination and diagnosis tailored to your specific needs.",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: ClipboardList,
    title: "Treatment plan",
    description: "Our team creates a personalized treatment plan for you, explaining all options and answering your concerns to ensure the best care.",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: Stethoscope,
    title: "Treatment and follow-up",
    description: "Receive your treatment with state-of-the-art facilities. Our nursing staff will monitor your progress and provide follow-up care.",
    color: "bg-rose-100 text-rose-600",
  },
];

export default function Process() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-medical-200 to-transparent opacity-30" />
      
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16 px-4">
          <div className="inline-flex items-center gap-2 text-medical-600 font-bold text-xs uppercase tracking-widest mb-4">
            <span className="w-8 h-0.5 bg-medical-600" />
            Easy Solutions
            <span className="w-8 h-0.5 bg-medical-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-6 leading-tight">
            4 Easy Step and Get the <span className="text-gradient">World Best Treatment</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-24 left-1/2 -translate-x-1/2 w-[80%] h-0.5 border-t-2 border-dashed border-slate-200" />
          
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className={`w-20 h-20 ${step.color} rounded-3xl flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                <step.icon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-medical-600 transition-colors">
                {step.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed px-4">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
