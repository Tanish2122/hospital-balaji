import React from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Stethoscope, Clock, ShieldCheck, ArrowLeft, Phone } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { orthopedicServices } from "@/data/orthopedicServices";
import { services as localServices } from "@/data/services";
import ServiceBookingCTA from "@/components/departments/ServiceBookingCTA";

export const revalidate = 60;

async function getService(category: string, slug: string) {
  if (category === "orthopedic") {
    // Try Supabase orthopedic_services first
    try {
      const { data, error } = await supabase
        .from("orthopedic_services")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

      if (!error && data) {
        return {
          id: data.slug,
          title: data.title,
          summary: data.summary,
          content: data.content,
          features: Array.isArray(data.features) ? data.features : [],
          image: data.image_url || "/images/gallery/ot.png",
          metaDescription: data.meta_description,
          keywords: Array.isArray(data.keywords) ? data.keywords : [],
          category: "Orthopedic",
        };
      }
    } catch {
      // Fall through
    }

    // Local orthopedic data fallback
    const local = orthopedicServices.find((s) => s.slug === slug);
    if (local) {
      return {
        id: local.slug,
        title: local.title,
        summary: local.summary,
        content: local.content,
        features: local.features,
        image: local.image,
        metaDescription: local.metaDescription,
        keywords: local.keywords,
        category: "Orthopedic",
      };
    }
  }

  // ENT / Speciality — use local services
  const local = localServices.find((s) => s.id === slug);
  if (local) {
    return {
      id: local.id,
      title: local.title,
      summary: local.description,
      content: local.content || local.description,
      features: local.features || [],
      image: local.image,
      metaDescription: local.description.slice(0, 160),
      keywords: [],
      category: local.category,
    };
  }

  // Fallback: Supabase departments table
  try {
    const { data, error } = await supabase
      .from("departments")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (!error && data) {
      return {
        id: data.slug,
        title: data.name,
        summary: data.description,
        content: data.description,
        features: [],
        image: data.icon_image_url || "/images/gallery/ot.png",
        metaDescription: (data.description || "").slice(0, 160),
        keywords: [],
        category: category.charAt(0).toUpperCase() + category.slice(1),
      };
    }
  } catch {
    // not found
  }

  return null;
}

async function getSiblingServices(category: string, currentSlug: string) {
  if (category === "orthopedic") {
    const seen = new Set<string>();
    return orthopedicServices
      .filter((s) => {
        if (s.slug === currentSlug || seen.has(s.slug)) return false;
        seen.add(s.slug);
        return true;
      })
      .slice(0, 5)
      .map((s) => ({ id: s.slug, name: s.title, slug: s.slug }));
  }
  const catValue = category === "ent" ? "ENT" : "Speciality";
  return localServices
    .filter((s) => s.category === catValue && s.id !== currentSlug)
    .slice(0, 5)
    .map((s) => ({ id: s.id, name: s.title, slug: s.id }));
}

export async function generateStaticParams(): Promise<{ category: string; slug: string }[]> {
  const params: { category: string; slug: string }[] = [];

  // Orthopedic from local data
  const seen = new Set<string>();
  orthopedicServices.forEach((s) => {
    if (!seen.has(s.slug)) {
      seen.add(s.slug);
      params.push({ category: "orthopedic", slug: s.slug });
    }
  });

  // ENT + Speciality from local services
  localServices.forEach((s) => {
    const cat = s.category === "ENT" ? "ent" : s.category === "Speciality" ? "speciality" : null;
    if (cat) params.push({ category: cat, slug: s.id });
  });

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const service = await getService(category, slug);
  if (!service) return {};
  return {
    title: `${service.title} | Balaji Hospital Jaipur`,
    description: service.metaDescription || service.summary,
  };
}

const ServiceDetailPage = async ({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) => {
  const { category, slug } = await params;
  const service = await getService(category, slug);

  if (!service) notFound();

  const siblings = await getSiblingServices(category, slug);

  return (
    <main className="pt-24 pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-medical-50 via-white to-slate-50 py-16 mb-16 border-b border-slate-100">
        <Container>
          <div className="max-w-3xl">
            <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-6 uppercase tracking-widest">
              <Link href="/departments" className="hover:text-medical-600 transition-colors">
                Departments
              </Link>
              <span>/</span>
              <Link
                href={`/departments/${category}`}
                className="hover:text-medical-600 transition-colors capitalize"
              >
                {category}
              </Link>
              <span>/</span>
              <span className="text-medical-600">{service.title}</span>
            </nav>

            <Link
              href={`/departments/${category}`}
              className="inline-flex items-center gap-2 text-medical-600 font-bold mb-6 hover:gap-3 transition-all text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {category.charAt(0).toUpperCase() + category.slice(1)} Services
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-poppins leading-tight">
              {service.title}
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              {service.summary}
            </p>

            {service.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {service.keywords.slice(0, 4).map((kw: string) => (
                  <span
                    key={kw}
                    className="px-3 py-1 bg-medical-50 border border-medical-100 rounded-full text-xs font-semibold text-medical-700"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Hero image */}
            <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl bg-slate-100">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
              <div className="absolute bottom-6 left-8">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-xs font-bold uppercase tracking-widest">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Expert Care at Balaji Hospital
                </span>
              </div>
            </div>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-6 font-poppins">
                Overview
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-6">
                {service.content.split("\n\n").map((chunk: string, i: number) => {
                  const parseInline = (text: string) => {
                    const parts = text.split(/(\*\*.*?\*\*)/);
                    return parts.map((part, partIdx) => {
                      if (part.startsWith("**") && part.endsWith("**")) {
                        return (
                          <strong key={partIdx} className="text-slate-900 font-bold">
                            {part.slice(2, -2)}
                          </strong>
                        );
                      }
                      return part;
                    });
                  };

                  if (chunk.startsWith("### ")) {
                    return (
                      <h3
                        key={i}
                        className="text-xl font-bold text-slate-900 mt-8 mb-4 font-poppins border-l-4 border-medical-600 pl-4"
                      >
                        {parseInline(chunk.replace("### ", ""))}
                      </h3>
                    );
                  }
                  if (chunk.startsWith("- ")) {
                    return (
                      <ul key={i} className="list-disc pl-5 space-y-2">
                        {chunk.split("\n").map((li, liIdx) => (
                          <li key={liIdx}>{parseInline(li.replace("- ", ""))}</li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={i}>{parseInline(chunk)}</p>;
                })}
              </div>
            </section>

            {/* Key Treatments / Features */}
            {service.features.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-8 font-poppins">
                  Key Treatments & Services
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.features.map((feature: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-5 bg-white rounded-2xl border border-slate-100 hover:border-medical-200 hover:shadow-md transition-all group"
                    >
                      <div className="w-8 h-8 bg-medical-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-medical-600 transition-colors">
                        <CheckCircle2 className="w-4 h-4 text-medical-600 group-hover:text-white transition-colors" />
                      </div>
                      <span className="font-semibold text-slate-700 text-sm leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Why Balaji */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-5 font-poppins flex items-center gap-3">
                  <Stethoscope className="w-6 h-6 text-medical-600" />
                  Why Choose Balaji?
                </h3>
                <ul className="space-y-3">
                  {[
                    "25+ years of orthopaedic excellence",
                    "50,000+ successful surgeries",
                    "Minimally invasive techniques",
                    "State-of-the-art OT & ICU",
                    "Dedicated physiotherapy centre",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4 text-medical-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 bg-medical-600 rounded-3xl text-white">
                <h3 className="text-xs font-bold mb-5 font-poppins flex items-center gap-3 text-medical-100 uppercase tracking-widest">
                  <ShieldCheck className="w-5 h-5" />
                  Quality Assurance
                </h3>
                <p className="text-medical-50 leading-relaxed text-sm mb-4">
                  We follow strict international protocols for surgical safety and hygiene. All implants are internationally certified, sourced from leading global manufacturers.
                </p>
                <p className="text-medical-100 text-xs font-semibold">
                  Member: Indian Orthopaedic Association (IOA) · NABH standards
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-28">
            {/* Booking CTA */}
            <ServiceBookingCTA
              serviceName={service.title}
              category={service.category}
            />

            {/* Contact */}
            <div className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">
                Direct Contact
              </h3>
              <a
                href="tel:+917276229049"
                className="flex items-center gap-3 text-slate-600 hover:text-medical-600 transition-colors font-semibold mb-3"
              >
                <Phone className="w-4 h-4 text-medical-500" />
                +91 7276229049
              </a>
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                <Clock className="w-3.5 h-3.5" />
                24/7 Emergency Available
              </div>
            </div>

            {/* Other Services */}
            {siblings.length > 0 && (
              <div className="p-6 bg-slate-900 rounded-[2rem] text-white">
                <h3 className="text-sm font-bold mb-5 text-amber-400 uppercase tracking-widest">
                  Related Services
                </h3>
                <ul className="space-y-3">
                  {siblings.map((s) => (
                    <li key={s.id}>
                      <Link
                        href={`/departments/${category}/${s.slug}`}
                        className="text-slate-400 hover:text-white transition-colors flex items-center justify-between group text-sm font-medium"
                      >
                        {s.name}
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </Container>
    </main>
  );
};

export default ServiceDetailPage;
