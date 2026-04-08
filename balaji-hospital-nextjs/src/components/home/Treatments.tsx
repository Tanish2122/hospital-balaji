"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Container from "../ui/Container";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

const STATIC_TREATMENTS = [
  // ... (keeping as fallback)
];

const CATEGORY_COLORS: Record<string, string> = {
  orthopedic: "bg-amber-50 text-amber-600",
  ent: "bg-blue-50 text-blue-600",
  rehabilitation: "bg-emerald-50 text-emerald-600",
  speciality: "bg-purple-50 text-purple-600",
};

const CATEGORY_LINKS: Record<string, string> = {
  orthopedic: "/orthopedic",
  ent: "/ent",
  speciality: "/speciality",
};

export default function Treatments() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTreatments() {
      try {
        const { data, error } = await supabase
          .from("departments")
          .select("*")
          .eq("is_active", true)
          .limit(6);

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped = data.map((d: any) => {
            const cat = (d.category || "speciality").toLowerCase();
            const baseHref = CATEGORY_LINKS[cat] || "/speciality";
            
            return {
              title: d.name,
              category: d.category || "General",
              description: d.description || "Expert medical care at Balaji Hospital.",
              image: d.image || "https://balajihospitaljaipur.com/uploads/gallery/5729652157ot-small.png",
              color: CATEGORY_COLORS[cat] || "bg-slate-50 text-slate-600",
              href: `${baseHref}/${d.slug}`,
            };
          });
          setItems(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch treatments:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTreatments();
  }, []);

  return (
    <section id="treatments" className="py-24 bg-slate-50 relative overflow-hidden">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-medical-600 font-bold text-xs uppercase tracking-widest mb-4">
            <span className="w-8 h-0.5 bg-medical-600" />
            Our Treatments
            <span className="w-8 h-0.5 bg-medical-600" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-6 underline decoration-medical-100 decoration-8 underline-offset-4">
            Specialized <span className="text-gradient">Procedures</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Expert surgical and non-surgical care across orthopaedic, ENT, and speciality disciplines
            using the latest minimally invasive technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-medical-600 mb-4" />
              <p className="text-slate-500 font-medium">Updating treatments from CMS...</p>
            </div>
          ) : items.length > 0 ? (
            items.map((treatment, index) => (
              <motion.div
                key={treatment.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:border-medical-500 transition-all duration-300 group hover:shadow-2xl hover:shadow-medical-500/10"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={treatment.image}
                    alt={treatment.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                  <div className="absolute bottom-5 left-6 text-white">
                    <h3 className="text-xl font-bold mb-1 line-clamp-1">{treatment.title}</h3>
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${treatment.color} border border-white/20`}
                    >
                      {treatment.category}
                    </div>
                  </div>
                </div>
                <div className="p-7">
                  <p className="text-slate-600 text-sm mb-5 leading-relaxed line-clamp-2">
                    {treatment.description}
                  </p>
                  <Link
                    href={treatment.href}
                    className="text-sm font-bold text-slate-900 hover:text-medical-600 transition-colors flex items-center gap-2 group/btn"
                  >
                    Learn More{" "}
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            )
          )) : (
            <div className="col-span-full text-center py-20 text-slate-400">
               No treatments currently available.
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/departments"
            className="inline-flex items-center gap-2 px-8 py-4 bg-medical-600 text-white rounded-2xl font-bold hover:bg-medical-700 transition-all shadow-xl shadow-medical-500/20"
          >
            View All Departments <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
