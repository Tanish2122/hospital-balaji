"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Container from "../ui/Container";
import { supabase } from "@/lib/supabase";

const staticTestimonials = [
  {
    name: "Suresh Sharma",
    role: "Knee Replacement Patient",
    content:
      "Dr. Ramesh Agarwal performed my total knee replacement at Balaji Hospital. The surgery was successful and within 3 weeks I was walking without pain. The physiotherapy team guided me through recovery. Highly recommend!",
    initials: "SS",
    color: "bg-medical-100 text-medical-700",
    rating: 5,
  },
  {
    name: "Priya Gupta",
    role: "ENT Surgery Patient",
    content:
      "I had chronic sinusitis for years and Dr. Saloni Agarwal's endoscopic surgery was life-changing. The staff at Balaji Hospital is very caring and the facility is extremely clean. I'm breathing freely now after years of suffering.",
    initials: "PG",
    color: "bg-amber-100 text-amber-700",
    rating: 5,
  },
  {
    name: "Rajendra Verma",
    role: "Spine Treatment Patient",
    content:
      "I came to Balaji Hospital with severe back pain. After a thorough evaluation, Dr. Ramesh Agarwal recommended physiotherapy followed by a minor procedure. I'm 90% better now. The hospital is affordable and the care is top-notch.",
    initials: "RV",
    color: "bg-emerald-100 text-emerald-700",
    rating: 5,
  },
];

// Loading skeleton to prevent CLS
function TestimonialSkeleton() {
  return (
    <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 animate-pulse">
      <div className="w-12 h-12 bg-slate-200 rounded-2xl mb-8" />
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-slate-200 rounded" />
        ))}
      </div>
      <div className="space-y-2 mb-8">
        <div className="h-4 bg-slate-200 rounded w-full" />
        <div className="h-4 bg-slate-200 rounded w-5/6" />
        <div className="h-4 bg-slate-200 rounded w-4/6" />
      </div>
      <div className="flex items-center gap-4 pt-8 border-t border-slate-200">
        <div className="w-14 h-14 bg-slate-200 rounded-2xl" />
        <div>
          <div className="h-4 bg-slate-200 rounded w-24 mb-2" />
          <div className="h-3 bg-slate-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [testis, setTestis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('is_approved', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) {
          setTestis(data.map(t => ({
            name: t.patient_name,
            role: "Patient",
            content: t.content,
            initials: t.patient_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
            color: "bg-medical-100 text-medical-700",
            rating: t.rating || 5
          })));
        } else {
          setTestis(staticTestimonials);
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setTestis(staticTestimonials);
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  const displayData = loading ? staticTestimonials : testis;

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
          {loading && testis.length === 0 ? (
            // Show skeletons while loading from Supabase
            <>
              {[...Array(3)].map((_, i) => (
                <TestimonialSkeleton key={i} />
              ))}
            </>
          ) : (
            displayData.map((testimonial, index) => (
              <motion.div
                key={testimonial.name + index}
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

                <div className="flex items-center gap-1 text-amber-400 mb-6" role="img" aria-label={`${testimonial.rating || 5} out of 5 stars`}>
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-slate-700 mb-8 leading-relaxed font-medium italic">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                <div className="flex items-center gap-4 pt-8 border-t border-slate-200">
                  <div
                    className={`w-14 h-14 rounded-2xl ${testimonial.color || 'bg-medical-100 text-medical-700'} flex items-center justify-center font-black text-xl shadow-sm shrink-0`}
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
            ))
          )}
        </div>
      </Container>
    </section>
  );
}
