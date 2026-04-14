import React from "react";
import Container from "@/components/ui/Container";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { orthopedicServices } from "@/data/orthopedicServices";
import { services as localServices } from "@/data/services";
import {
  orthopedicDataToSeoSlug,
  entDataToSeoSlug,
  otherDataToSeoSlug,
} from "@/data/seoSlugMap";

export const metadata = {
  title: "Best Hospital Departments in Jaipur | Balaji Hospital",
  description:
    "Explore all departments at Balaji Hospital Jaipur — Best Orthopedic Hospital, ENT Specialist & Other Specialised Departments since 1996. Kidney stones, spine surgery, vascular & more.",
  keywords: [
    "best orthopedic hospital in jaipur",
    "ent specialist in jaipur",
    "kidney stones treatment jaipur",
    "spine treatment jaipur",
    "knee replacement jaipur",
    "medical departments jaipur",
  ],
  alternates: { canonical: "https://balajihospitaljaipur.com/departments" },
  openGraph: {
    title: "Best Hospital Departments in Jaipur | Balaji Hospital",
    description:
      "Expert Orthopedic, ENT & Speciality care at Balaji Hospital Jaipur since 1996. 50,000+ surgeries. Book now.",
    url: "https://balajihospitaljaipur.com/departments",
  },
};

export const revalidate = 60;

/** Resolve data slug → canonical SEO URL */
function toSeoUrl(dataSlug: string, rawCategory: string): string {
  if (rawCategory === "orthopedic") {
    const seoSlug = orthopedicDataToSeoSlug[dataSlug];
    return seoSlug ? `/orthopedic/${seoSlug}` : `/orthopedic`;
  }
  if (rawCategory === "ent") {
    const seoSlug = entDataToSeoSlug[dataSlug];
    return seoSlug ? `/ent/${seoSlug}` : `/ent`;
  }
  if (rawCategory === "other" || rawCategory === "speciality") {
    const seoSlug = otherDataToSeoSlug[dataSlug];
    return seoSlug ? `/speciality/${seoSlug}` : `/speciality`;
  }
  return `/departments/${rawCategory}/${dataSlug}`;
}

async function getDepartments() {
  try {
    const { data, error } = await supabase
      .from("departments")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (!error && data && data.length > 0)
      return data.map((d: any) => ({
        id: d.slug,
        name: d.name,
        slug: d.slug,
        description: d.description,
        category: d.category?.toLowerCase() || "orthopedic",
      }));
  } catch {
    // Fall through to local
  }

  const seen = new Set<string>();
  const orthoDeduped = orthopedicServices.filter((s) => {
    if (seen.has(s.slug)) return false;
    seen.add(s.slug);
    return true;
  });

  return [
    ...orthoDeduped.map((s) => ({
      id: s.slug,
      name: s.title,
      slug: s.slug,
      description: s.summary,
      category: "orthopedic",
    })),
    ...localServices
      .filter((s) => s.category === "ENT" || s.category === "Other")
      .map((s) => ({
        id: s.id,
        name: s.title,
        slug: s.id,
        description: s.description,
        category: s.category === "ENT" ? "ent" : "other",
      })),
  ];
}

const categoryHubs = [
  {
    label: "Best Orthopedic Hospital in Jaipur",
    subtitle: "Knee, Hip, Spine, Fracture & more",
    href: "/orthopedic",
    color: "bg-amber-50 border-amber-200 text-amber-700",
    iconBg: "bg-amber-100",
    icon: "🦴",
    stats: "50,000+ Surgeries",
  },
  {
    label: "ENT Specialist in Jaipur",
    subtitle: "Ear, Nose & Throat Surgery",
    href: "/ent",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    iconBg: "bg-blue-100",
    icon: "👂",
    stats: "Advanced Endoscopic Care",
  },
  {
    label: "Other Specialised Departments",
    subtitle: "Kidney Stones & Vascular Surgery",
    href: "/speciality",
    color: "bg-purple-50 border-purple-200 text-purple-700",
    iconBg: "bg-purple-100",
    icon: "🔬",
    stats: "Expert Surgical Solutions",
  },
];

const allKeywordLinks = [
  { label: "Best Knee Replacement Hospital in Jaipur",            href: "/orthopedic/best-knee-replacement-hospital-in-jaipur" },
  { label: "Hip Replacement Hospital in Jaipur",                  href: "/orthopedic/hip-replacement-hospital-in-jaipur" },
  { label: "Spine Treatment in Jaipur",                           href: "/orthopedic/spine-treatment-in-jaipur" },
  { label: "Best Fracture Treatment in Jaipur",                   href: "/orthopedic/best-fracture-treatment-in-jaipur" },
  { label: "Shoulder Arthroscopy Replacement in Jaipur",          href: "/orthopedic/shoulder-arthroscopy-replacement-in-jaipur" },
  { label: "Hand & Upper Limb Surgery in Jaipur",                 href: "/orthopedic/hand-upper-limb-surgery-in-jaipur" },
  { label: "Ankle Replacement in Jaipur",                         href: "/orthopedic/ankle-replacement-in-jaipur" },
  { label: "Joint Pain Treatment in Jaipur",                      href: "/orthopedic/joint-pain-treatment-in-jaipur" },
  { label: "Paediatric Orthopaedics Treatment in Jaipur",         href: "/orthopedic/paediatric-orthopaedics-treatment-in-jaipur" },
  { label: "Plastic & Vascular Surgery in Jaipur",                href: "/orthopedic/plastic-vascular-surgery-in-jaipur" },
  { label: "Physiotherapy & Rehabilitation Centre in Jaipur",     href: "/orthopedic/physiotherapy-and-rehabilitation-centre-in-jaipur" },
  { label: "Best Orthopedic Hospital in Jaipur",                  href: "/orthopedic/best-orthopedic-hospital-in-jaipur" },
  { label: "Best Sports Medicine Hospital in Jaipur",             href: "/orthopedic/best-sports-medicine-hospital-in-jaipur" },
  { label: "Best Ear Surgery Hospital in Jaipur",                 href: "/ent/best-ear-surgery-hospital-in-jaipur" },
  { label: "Best Nose Surgery Hospital in Jaipur",                href: "/ent/best-nose-surgery-hospital-in-jaipur" },
  { label: "Best Throat Surgery Hospital in Jaipur",              href: "/ent/best-throat-surgery-hospital-in-jaipur" },
  { label: "Kidney Stones Treatment in Jaipur",                   href: "/speciality/kidney-stones-treatment-in-jaipur" },
];

export default async function DepartmentsPage() {
  const departments = await getDepartments();

  return (
    <main className="pt-24 pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-medical-50 via-white to-slate-50 py-16 mb-16 border-b border-slate-100">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-poppins">
              Best Hospital Departments in Jaipur
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Balaji Hospital &amp; Orthopaedic Centre offers specialised care across Orthopaedic, ENT, and Surgical
              disciplines — using the latest minimally invasive techniques and state-of-the-art equipment since 1996.
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
                Call: +91 7276229049
              </a>
            </div>
          </div>
        </Container>
      </section>

      <Container>
        {/* Category Hub Cards */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 font-poppins">Browse by Department</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categoryHubs.map((hub) => (
              <Link
                key={hub.href}
                href={hub.href}
                className={`group p-8 rounded-[2rem] border-2 ${hub.color} hover:shadow-xl transition-all hover:-translate-y-1 duration-300 flex flex-col`}
              >
                <div className={`w-14 h-14 ${hub.iconBg} rounded-2xl flex items-center justify-center mb-5 text-2xl shrink-0`}>
                  {hub.icon}
                </div>
                <div className="text-xs font-bold uppercase tracking-widest mb-2 opacity-60">{hub.stats}</div>
                <h2 className="text-xl font-bold text-slate-900 mb-2 font-poppins group-hover:underline leading-snug">
                  {hub.label}
                </h2>
                <p className="text-sm text-slate-600 mb-5 flex-grow">{hub.subtitle}</p>
                <div className="inline-flex items-center gap-2 font-bold text-sm group-hover:gap-4 transition-all">
                  Explore All Services <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* All Service Cards */}
        <div className="space-y-12 mb-16">
          <div className="flex items-center gap-4">
            <div className="h-px bg-slate-200 flex-grow" />
            <h2 className="text-2xl font-bold text-slate-400 font-poppins uppercase tracking-widest flex items-center gap-3 whitespace-nowrap">
              <span className="text-medical-600">All</span> Services
            </h2>
            <div className="h-px bg-slate-200 flex-grow" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((dept: any) => {
              const seoUrl = toSeoUrl(dept.slug, dept.category);
              return (
                <div
                  key={dept.id}
                  className="group p-8 bg-white rounded-[2.5rem] border border-slate-100 hover:border-medical-200 transition-all hover:shadow-2xl hover:shadow-medical-100 flex flex-col"
                >
                  <div className="w-16 h-16 bg-medical-50 rounded-2xl flex items-center justify-center mb-8 text-medical-600 group-hover:bg-medical-600 group-hover:text-white transition-all duration-500 shrink-0">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 font-poppins group-hover:text-medical-600 transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-8 flex-grow text-sm line-clamp-3">
                    {dept.description || "Comprehensive care and specialized treatments provided by our expert medical professionals."}
                  </p>
                  <Link
                    href={seoUrl}
                    className="inline-flex items-center gap-2 font-bold text-medical-600 group-hover:gap-4 transition-all"
                    title={`${dept.name} at Balaji Hospital Jaipur`}
                  >
                    Learn More
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              );
            })}
          </div>

          {departments.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <p>No departments found. Please ensure they are added in the Supabase database.</p>
            </div>
          )}
        </div>

        {/* SEO Internal Links — all 17 keyword pages */}
        <section className="mb-16 p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6 font-poppins">
            Popular Treatments at Balaji Hospital Jaipur
          </h2>
          <div className="flex flex-wrap gap-3">
            {allKeywordLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-semibold text-slate-700 hover:bg-medical-600 hover:text-white hover:border-medical-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-bold mb-6 font-poppins">Can't find what you're looking for?</h2>
            <p className="text-slate-400 text-lg mb-8">
              We offer several other specialised treatments not listed here. Contact our front desk for detailed
              enquiries.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/appointment"
                className="inline-flex items-center gap-3 px-8 py-4 bg-medical-600 text-white rounded-2xl font-bold hover:bg-medical-700 transition-all shadow-xl shadow-medical-900/40"
              >
                Book Appointment <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="tel:+917276229049"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-bold hover:bg-white/20 transition-all"
              >
                +91 7276229049
              </a>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-medical-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        </section>
      </Container>
    </main>
  );
}
