import React from "react";
import Container from "@/components/ui/Container";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Stethoscope, Clock, ShieldCheck, Activity, HeartPulse, Users, Bone, Wind } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { orthopedicServices } from "@/data/orthopedicServices";
import { services as localServices } from "@/data/services";
import DepartmentCategoryCTA from "@/components/departments/DepartmentCategoryCTA";

type CategoryParam = "orthopedic" | "ent" | "speciality";

const categoryMeta: Record<
  CategoryParam,
  { label: string; value: string; description: string; keywords: string[]; color: string; since?: string }
> = {
  orthopedic: {
    label: "Orthopedic Department",
    value: "Orthopedic",
    description:
      "Balaji Hospital is Jaipur's most trusted orthopaedic centre since 1996. Specialized in knee/hip replacement, spine surgery, and fracture management. Over 50,000 successful surgeries performed by senior surgeons.",
    keywords: ["best orthopedic hospital in jaipur", "knee replacement jaipur", "hip surgery jaipur", "spine specialist jaipur", "fracture treatment jaipur"],
    color: "bg-amber-50 border-amber-200 text-amber-700",
    since: "Since 1996 — 50,000+ Surgeries",
  },
  ent: {
    label: "ENT Department",
    value: "ENT",
    description:
      "Top ENT specialist hospital in Jaipur. Advanced endoscopic sinus surgery, microscopic ear surgery, and throat care by senior consultants. Expert hearing restoration and sinus treatment.",
    keywords: ["ent specialist in jaipur", "best ent hospital jaipur", "sinus surgery jaipur", "ear surgery jaipur", "throat specialist jaipur"],
    color: "bg-blue-50 border-blue-200 text-blue-700",
  },
  speciality: {
    label: "Speciality Department",
    value: "Speciality",
    description:
      "Multi-specialty care in Jaipur including advanced urology (kidney stones), plastic surgery, and vascular surgery. Expert surgical solutions for complex medical needs.",
    keywords: ["urologist in jaipur", "kidney stone treatment jaipur", "plastic surgery jaipur", "vascular surgeon jaipur"],
    color: "bg-purple-50 border-purple-200 text-purple-700",
  },
};

const iconMap: Record<string, React.ElementType> = {
  Activity,
  HeartPulse,
  Users,
  Bone,
  Stethoscope,
  Wind,
  CheckCircle2,
};

export const revalidate = 60;

export async function generateStaticParams() {
  return (Object.keys(categoryMeta) as CategoryParam[]).map((cat) => ({
    category: cat,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const meta = categoryMeta[category as CategoryParam];
  if (!meta) return {};
  return {
    title: `${meta.label} | Best Specialists in Jaipur`,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `https://balajihospitaljaipur.com/departments/${category}`,
    },
  };
}

async function getServicesForCategory(category: CategoryParam) {
  if (category === "orthopedic") {
    // Try Supabase first
    try {
      const { data, error } = await supabase
        .from("orthopedic_services")
        .select("*")
        .eq("is_active", true)
        .order("title", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((s: any) => ({
          id: s.slug,
          name: s.title,
          description: s.summary,
          slug: s.slug,
          features: Array.isArray(s.features) ? s.features : [],
          icon: s.icon || "Activity",
          url: `/departments/orthopedic/${s.slug}`,
        }));
      }
    } catch {
      // Fall through to local data
    }

    // Local fallback — deduplicate by slug
    const seen = new Set<string>();
    return orthopedicServices
      .filter((s) => {
        if (seen.has(s.slug)) return false;
        seen.add(s.slug);
        return true;
      })
      .map((s) => ({
        id: s.slug,
        name: s.title,
        description: s.summary,
        slug: s.slug,
        features: s.features,
        icon: s.icon,
        url: `/departments/orthopedic/${s.slug}`,
      }));
  }

  // ENT / Speciality — use local services data
  const catValue = category === "ent" ? "ENT" : "Speciality";
  return localServices
    .filter((s) => s.category === catValue)
    .map((s) => ({
      id: s.id,
      name: s.title,
      description: s.description,
      slug: s.id,
      features: s.features || [],
      icon: s.icon,
      url: `/departments/${category}/${s.id}`,
    }));
}

const DepartmentCategoryPage = async ({
  params,
}: {
  params: Promise<{ category: string }>;
}) => {
  const { category } = await params;
  const meta = categoryMeta[category as CategoryParam];
  if (!meta) notFound();

  const services = await getServicesForCategory(category as CategoryParam);

  return (
    <main className="pt-24 pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-medical-50 via-white to-slate-50 py-20 mb-16 border-b border-slate-100">
        <Container>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span
                className={`inline-flex px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${meta.color}`}
              >
                {meta.label}
              </span>
              {(meta as any).since && (
                <span className="inline-flex px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border bg-slate-900 text-white border-slate-900">
                  {(meta as any).since}
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-poppins">
              {meta.label}
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              {meta.description}
            </p>
          </div>
        </Container>
      </section>

      <Container>
        {/* Stats bar for Orthopedic */}
        {category === "orthopedic" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { label: "Since", value: "1996" },
              { label: "Surgeries", value: "50,000+" },
              { label: "Specialists", value: "15+" },
              { label: "Services", value: `${services.length}+` },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-6 bg-white rounded-2xl border border-slate-100 text-center shadow-sm"
              >
                <div className="text-3xl font-black text-medical-600 mb-1">{stat.value}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((svc, index) => {
            const IconComp = iconMap[svc.icon] || CheckCircle2;
            return (
              <Link
                key={svc.id}
                href={svc.url}
                className="group p-8 bg-white rounded-[2.5rem] border border-slate-100 hover:border-medical-300 transition-all hover:shadow-2xl hover:shadow-medical-100 flex flex-col hover:-translate-y-1 duration-300"
              >
                <div className="w-14 h-14 bg-medical-50 rounded-2xl flex items-center justify-center mb-6 text-medical-600 group-hover:bg-medical-600 group-hover:text-white transition-all duration-500 shrink-0">
                  <IconComp className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-3 font-poppins group-hover:text-medical-600 transition-colors">
                  {svc.name}
                </h2>
                <p className="text-slate-500 leading-relaxed mb-6 flex-grow text-sm line-clamp-3">
                  {svc.description}
                </p>
                {svc.features.length > 0 && (
                  <ul className="mb-6 space-y-1">
                    {svc.features.slice(0, 3).map((f: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-500 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-medical-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{f}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="inline-flex items-center gap-2 font-bold text-medical-600 text-sm group-hover:gap-4 transition-all">
                  Explore Treatment
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}

          {services.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
              <Stethoscope className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p>No treatments found for this category.</p>
            </div>
          )}
        </div>

        <DepartmentCategoryCTA metaLabel={meta.label} />

        {/* Back link */}
        <div className="mt-12 text-center">
          <Link
            href="/departments"
            className="inline-flex items-center gap-2 font-bold text-slate-400 hover:text-medical-600 transition-colors"
          >
            ← View All Departments
          </Link>
        </div>
      </Container>
    </main>
  );
};

export default DepartmentCategoryPage;
