import React from "react";
import Container from "@/components/ui/Container";
import { ArrowRight, CheckCircle2, Bone, Activity, HeartPulse, Stethoscope, Users, Wind } from "lucide-react";
import Link from "next/link";
import { orthopedicServices } from "@/data/orthopedicServices";
import { orthopedicDataToSeoSlug } from "@/data/seoSlugMap";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Orthopedic Hospital in Jaipur | Balaji Hospital",
  description:
    "Balaji Hospital — Best Orthopedic Hospital in Jaipur since 1996. Expert surgeons for knee replacement, hip replacement, spine surgery & fracture care. 50,000+ surgeries. Book now.",
  keywords: [
    "Best Orthopedic hospital in jaipur",
    "orthopedic surgeon jaipur",
    "knee replacement jaipur",
    "hip replacement jaipur",
    "spine surgery jaipur",
  ],
  alternates: { canonical: "https://balajihospitaljaipur.com/orthopedic" },
  openGraph: {
    title: "Best Orthopedic Hospital in Jaipur | Balaji Hospital",
    description:
      "Jaipur's most trusted orthopedic centre since 1996. 50,000+ surgeries. Expert knee, hip, spine & fracture care.",
    url: "https://balajihospitaljaipur.com/orthopedic",
  },
};

const iconMap: Record<string, React.ElementType> = {
  Activity, HeartPulse, Users, Bone, Stethoscope, Wind, CheckCircle2,
};

// Deduplicate services
const seen = new Set<string>();
const services = orthopedicServices.filter((s) => {
  if (seen.has(s.slug)) return false;
  seen.add(s.slug);
  return true;
});

export default function OrthopedicPage() {
  return (
    <main className="pt-24 pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-medical-50 via-white to-slate-50 py-20 mb-16 border-b border-slate-100">
        <Container>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border bg-amber-50 border-amber-200 text-amber-700">
                Orthopedic Department
              </span>
              <span className="inline-flex px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border bg-slate-900 text-white border-slate-900">
                Since 1996 — 50,000+ Surgeries
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-poppins">
              Best Orthopedic Hospital in Jaipur
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Balaji Hospital is Jaipur's most trusted orthopaedic centre since 1996. Specialized in knee &amp; hip
              replacement, spine surgery, and fracture management. Over 50,000 successful surgeries performed by senior
              surgeons with 25+ years of experience.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                href="/appointment"
                className="inline-flex items-center gap-2 px-6 py-3 bg-medical-600 text-white rounded-full font-bold hover:bg-medical-700 transition-colors"
              >
                Book Appointment <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:+917276229049"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-medical-600 text-medical-600 rounded-full font-bold hover:bg-medical-50 transition-colors"
              >
                Call Now: +91 7276229049
              </a>
            </div>
          </div>
        </Container>
      </section>

      <Container>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { label: "Since", value: "1996" },
            { label: "Surgeries", value: "50,000+" },
            { label: "Specialists", value: "15+" },
            { label: "Services", value: `${services.length}+` },
          ].map((stat) => (
            <div key={stat.label} className="p-6 bg-white rounded-2xl border border-slate-100 text-center shadow-sm">
              <div className="text-3xl font-black text-medical-600 mb-1">{stat.value}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Services Grid */}
        <h2 className="text-2xl font-bold text-slate-900 mb-8 font-poppins">Our Orthopedic Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((svc) => {
            const seoSlug = orthopedicDataToSeoSlug[svc.slug];
            const href = seoSlug ? `/orthopedic/${seoSlug}` : `/departments/orthopedic/${svc.slug}`;
            const IconComp = iconMap[svc.icon] || CheckCircle2;
            return (
              <Link
                key={svc.slug}
                href={href}
                className="group p-8 bg-white rounded-[2.5rem] border border-slate-100 hover:border-medical-300 transition-all hover:shadow-2xl hover:shadow-medical-100 flex flex-col hover:-translate-y-1 duration-300"
              >
                <div className="w-14 h-14 bg-medical-50 rounded-2xl flex items-center justify-center mb-6 text-medical-600 group-hover:bg-medical-600 group-hover:text-white transition-all duration-500 shrink-0">
                  <IconComp className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-3 font-poppins group-hover:text-medical-600 transition-colors">
                  {svc.title}
                </h2>
                <p className="text-slate-500 leading-relaxed mb-6 flex-grow text-sm line-clamp-3">{svc.summary}</p>
                {svc.features.length > 0 && (
                  <ul className="mb-6 space-y-1">
                    {svc.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-500 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-medical-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{f}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="inline-flex items-center gap-2 font-bold text-medical-600 text-sm group-hover:gap-4 transition-all">
                  Explore Treatment <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Why Choose */}
        <section className="bg-slate-900 rounded-[2.5rem] p-10 md:p-16 text-white mb-12">
          <h2 className="text-3xl font-bold mb-4 font-poppins">Why Choose Balaji Hospital for Orthopedic Care?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl">
            Patients across Jaipur and Rajasthan trust Balaji Hospital for safe, affordable, and expert orthopedic
            treatment. Here's what sets us apart:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "30+ years of orthopedic expertise",
              "50,000+ successful surgeries",
              "Minimally invasive techniques",
              "Internationally certified implants",
              "Dedicated physiotherapy centre",
              "24/7 emergency trauma care",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-slate-200 font-medium">
                <CheckCircle2 className="w-5 h-5 text-medical-400 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* Internal Links */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 font-poppins">Related Services at Balaji Hospital</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "ENT Department", href: "/ent" },
              { label: "Kidney Stones Treatment in Jaipur", href: "/speciality/kidney-stones-treatment-in-jaipur" },
              { label: "About Balaji Hospital", href: "/about" },
              { label: "Book Appointment", href: "/appointment" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 bg-medical-50 border border-medical-100 rounded-full text-sm font-semibold text-medical-700 hover:bg-medical-600 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}
