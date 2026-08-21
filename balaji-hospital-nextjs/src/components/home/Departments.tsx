"use client";

import { motion } from "framer-motion";
import Container from "../ui/Container";
import Link from "next/link";
import {
  Bone,
  Stethoscope,
  Microscope,
  Wind,
  Activity,
  Flame,
  HeartPulse,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { orthopedicDataToSeoSlug, entDataToSeoSlug, otherDataToSeoSlug } from "@/data/seoSlugMap";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

// ── Static keyword-rich fallback data ────────────────────────────────────────
// Titles and hrefs use exact keywords from the SEO sheet
const staticServices = [
  {
    id: "fracture-treatment",
    slug: "fracture-treatment",
    title: "Best Fracture Treatment in Jaipur",
    description:
      "Emergency and specialized care for all types of bone fractures — from simple closed fractures to complex open fractures — using modern internal and external fixation techniques.",
    category: "Orthopedic",
    url: "/orthopedic/best-fracture-treatment-in-jaipur",
  },
  {
    id: "knee-replacement",
    slug: "knee-replacement",
    title: "Best Knee Replacement Hospital in Jaipur",
    description:
      "Advanced total and partial knee replacement surgery using minimally invasive techniques for faster recovery, reduced pain, and improved mobility in arthritis patients.",
    category: "Orthopedic",
    url: "/orthopedic/best-knee-replacement-hospital-in-jaipur",
  },
  {
    id: "hip-replacement",
    slug: "hip-replacement",
    title: "Hip Replacement Hospital in Jaipur",
    description:
      "Expert surgical solutions for chronic hip pain, avascular necrosis, and arthritis — restoring an active, pain-free lifestyle using cemented and cementless prostheses.",
    category: "Orthopedic",
    url: "/orthopedic/hip-replacement-hospital-in-jaipur",
  },
  {
    id: "spine-treatment",
    slug: "spine-treatment",
    title: "Spine Treatment in Jaipur",
    description:
      "Comprehensive care for spinal disorders including herniated discs, spinal stenosis, scoliosis, and complex deformity correction. Advanced surgical & non-surgical options.",
    category: "Orthopedic",
    url: "/orthopedic/spine-treatment-in-jaipur",
  },
  {
    id: "ear-surgery",
    slug: "ear-surgery",
    title: "Best Ear Surgery Hospital in Jaipur",
    description:
      "Microscopic and endoscopic ear surgeries for hearing restoration and chronic infections. Expert tympanoplasty, mastoidectomy & stapedectomy by Dr. Saloni Agarwal.",
    category: "ENT",
    url: "/ent/best-ear-surgery-hospital-in-jaipur",
  },
  {
    id: "best-acl-surgeon-in-jaipur",
    slug: "best-acl-surgeon-in-jaipur",
    title: "Best ACL Surgeon in Jaipur",
    description:
      "Reliable surgical solution for ACL tears, restoring knee stability and function.",
    category: "Orthopedic",
    url: "/orthopedic/best-sports-medicine-hospital-in-jaipur",
  },
];

const HOME_SLUGS = [
  "fracture-treatment",
  "knee-replacement",
  "hip-replacement",
  "spine-treatment",
  "ear-surgery",
  "best-acl-surgeon-in-jaipur"
];

const getIcon = (slug: string) => {
  switch (slug) {
    case "spine-treatment":           return Bone;
    case "knee-replacement":          return Activity;
    case "hip-replacement":           return Activity;
    case "fracture-treatment":        return Bone;
    case "shoulder-arthroscopy":      return HeartPulse;
    case "ear-surgery":               return Microscope;
    case "nose-surgery":              return Wind;
    case "throat-surgery":            return Wind;
    case "best-acl-surgeon-in-jaipur": return CheckCircle2;
    default:                          return Stethoscope;
  }
};

const getColor = (category: string) => {
  switch (category) {
    case "Orthopedic":  return "bg-amber-100 text-amber-600";
    case "ENT":         return "bg-blue-100 text-blue-600";
    case "Other":       return "bg-purple-100 text-purple-600";
    default:            return "bg-slate-100 text-slate-600";
  }
};

/** Resolve a service from Supabase to its canonical SEO URL */
function resolveUrl(slug: string, category: string): string {
  const cat = category?.toLowerCase();
  if (cat === "orthopedic" || cat === "orthopaedic") {
    const seoSlug = orthopedicDataToSeoSlug[slug];
    return seoSlug ? `/orthopedic/${seoSlug}` : `/orthopedic`;
  }
  if (cat === "ent") {
    const seoSlug = entDataToSeoSlug[slug];
    return seoSlug ? `/ent/${seoSlug}` : `/ent`;
  }
  if (cat === "other" || cat === "speciality") {
    const seoSlug = otherDataToSeoSlug[slug];
    return seoSlug ? `/speciality/${seoSlug}` : `/speciality`;
  }
  return `/departments`;
}

// Loading skeleton for CLS prevention
function DepartmentSkeleton() {
  return (
    <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 animate-pulse">
      <div className="w-16 h-16 bg-slate-200 rounded-2xl mb-6" />
      <div className="h-6 bg-slate-200 rounded-lg w-3/4 mb-4" />
      <div className="space-y-2 mb-6">
        <div className="h-4 bg-slate-200 rounded w-full" />
        <div className="h-4 bg-slate-200 rounded w-5/6" />
        <div className="h-4 bg-slate-200 rounded w-2/3" />
      </div>
      <div className="h-4 bg-slate-200 rounded w-24" />
    </div>
  );
}

export default function Departments() {
  const [items, setItems] = useState<any[]>(staticServices);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLiveServices() {
      try {
        const { data, error } = await supabase
          .from("departments")
          .select("*")
          .eq("is_active", true)
          .in("slug", HOME_SLUGS);

        if (error) throw error;

        if (data && data.length > 0) {
          // Merge Supabase data into the static list or replace it
          // We'll replace it but keep the static icons/colors
          const mapped = data.map((d: any) => {
            const staticMatch = staticServices.find(s => s.slug === d.slug);
            return {
              id: d.id,
              slug: d.slug,
              title: d.name, // Real name from CMS
              description: d.description || staticMatch?.description || "Expert medical care at Balaji Hospital.",
              category: d.category || staticMatch?.category || "Other",
              url: resolveUrl(d.slug, d.category),
            };
          });
          
          // Sort items by custom HOME_SLUGS order
          mapped.sort((a, b) => HOME_SLUGS.indexOf(a.slug) - HOME_SLUGS.indexOf(b.slug));
          
          setItems(mapped);
        }
      } catch (err) {
        console.error("Failed to sync departments:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLiveServices();
  }, []);

  const services = items;

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
            Centers of <span className="text-gradient">Excellence</span> in Orthopaedic & ENT
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Expert medical care specializing in Orthopaedic & ENT, with state-of-the-art equipment and experienced specialists.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = getIcon(service.slug);
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
                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-medical-600 transition-colors leading-snug">
                  {service.title.replace(/\s+in\s+jaipur/gi, "").trim()}
                </h3>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed line-clamp-3">
                  {service.description}
                </p>
                <Link
                  href={service.url}
                  className="flex items-center text-medical-600 font-bold text-sm group-hover:gap-2 transition-all"
                  aria-label={`Learn more about ${service.title}`}
                  title={service.title}
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -ml-2 group-hover:ml-0" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Full keyword link grid — SEO internal linking */}
        <div className="mt-12 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">All Treatments</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "Joint Pain Treatment in Jaipur",                      href: "/orthopedic/joint-pain-treatment-in-jaipur" },
              { label: "Shoulder Arthroscopy Replacement in Jaipur",          href: "/orthopedic/shoulder-arthroscopy-replacement-in-jaipur" },
              { label: "Ankle Replacement in Jaipur",                         href: "/orthopedic/ankle-replacement-in-jaipur" },
              { label: "Hand & Upper Limb Surgery in Jaipur",                 href: "/orthopedic/hand-upper-limb-surgery-in-jaipur" },
              { label: "Paediatric Orthopaedics Treatment in Jaipur",         href: "/orthopedic/paediatric-orthopaedics-treatment-in-jaipur" },
              { label: "Plastic & Vascular Surgery in Jaipur",                href: "/orthopedic/plastic-vascular-surgery-in-jaipur" },
              { label: "Physiotherapy & Rehabilitation Centre in Jaipur",     href: "/orthopedic/physiotherapy-and-rehabilitation-centre-in-jaipur" },
              { label: "Best Sports Medicine Hospital in Jaipur",             href: "/orthopedic/best-sports-medicine-hospital-in-jaipur" },
              { label: "Best Nose Surgery Hospital in Jaipur",                href: "/ent/best-nose-surgery-hospital-in-jaipur" },
              { label: "Best Throat Surgery Hospital in Jaipur",              href: "/ent/best-throat-surgery-hospital-in-jaipur" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600 hover:bg-medical-600 hover:text-white hover:border-medical-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <Link href="/departments" className="inline-flex items-center gap-2 text-medical-600 font-bold hover:text-medical-700 transition-all hover:gap-3">
            <span>View All Departments</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
