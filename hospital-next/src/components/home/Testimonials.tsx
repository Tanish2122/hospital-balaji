"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Container from "../ui/Container";

const testimonials = [
  {
    name: "Suresh Sharma",
    role: "Knee Replacement Patient",
    content:
      "Dr. Ramesh Agarwal performed my total knee replacement at Balaji Hospital. The surgery was successful and within 3 weeks I was walking without pain. The physiotherapy team guided me through recovery. Highly recommend!",
    initials: "SS",
    color: "bg-medical-100 text-medical-700",
  },
  {
    name: "Priya Gupta",
    role: "ENT Surgery Patient",
    content:
      "I had chronic sinusitis for years and Dr. Alok Maheshwari's endoscopic surgery was life-changing. The staff at Balaji Hospital is very caring and the facility is extremely clean. I'm breathing freely now after years of suffering.",
    initials: "PG",
    color: "bg-amber-100 text-amber-700",
  },
  {
    name: "Rajendra Verma",
    role: "Spine Treatment Patient",
    content:
      "I came to Balaji Hospital with severe back pain. After a thorough evaluation, Dr. Ramesh Agarwal recommended physiotherapy followed by a minor procedure. I'm 90% better now. The hospital is affordable and the care is top-notch.",
    initials: "RV",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    name: "Kavita Joshi",
    role: "Ear Surgery Patient",
    content:
      "My child had a hearing problem and Dr. Maheshwari performed a tympanoplasty. The team explained every step of the procedure patiently. Two months later my son's hearing is completely restored. Thank you Balaji Hospital!",
    initials: "KJ",
    color: "bg-rose-100 text-rose-700",
  },
  {
    name: "Mohan Lal",
    role: "Fracture Treatment Patient",
    content:
      "Had a complex wrist fracture after an accident. The emergency team at Balaji Hospital acted quickly. The surgery was done the same night. The doctors and nurses were professional and compassionate throughout my stay.",
    initials: "ML",
    color: "bg-blue-100 text-blue-700",
  },
  {
    name: "Anita Meena",
    role: "Physiotherapy Patient",
    content:
      "Dr. Sheela Agarwal and her physiotherapy team helped me regain full mobility after my hip surgery. The rehabilitation centre is well equipped and the sessions are personalised. I'm back to my normal routine in just 6 weeks.",
    initials: "AM",
    color: "bg-purple-100 text-purple-700",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-white relative overflow-hidden">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-medical-600 font-bold text-xs uppercase tracking-widest mb-4">
            <span className="w-8 h-0.5 bg-medical-600" />
            Patient Stories
            <span className="w-8 h-0.5 bg-medical-600" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-6 underline decoration-medical-100 decoration-8 underline-offset-4">
            What Our <span className="text-gradient">Patients Say</span>
          </h2>
          <p className="text-slate-600 text-lg">
            Real stories from patients across Jaipur and Rajasthan who trusted us with their care.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 hover:shadow-2xl hover:bg-white transition-all duration-500 relative group overflow-hidden"
            >
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-medical-100 rounded-full opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-700" />

              <div className="w-12 h-12 bg-medical-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-medical-500/20 group-hover:scale-110 transition-transform">
                <Quote className="w-6 h-6" />
              </div>

              <div className="flex items-center gap-1 text-amber-400 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              <p className="text-slate-700 mb-8 leading-relaxed font-medium italic">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              <div className="flex items-center gap-4 pt-8 border-t border-slate-200">
                <div
                  className={`w-14 h-14 rounded-2xl ${testimonial.color} flex items-center justify-center font-black text-xl shadow-sm shrink-0`}
                >
                  {testimonial.initials}
                </div>
                <div>
                  <div className="font-bold text-slate-900 leading-none mb-1">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-medical-600 font-bold uppercase tracking-wider">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
