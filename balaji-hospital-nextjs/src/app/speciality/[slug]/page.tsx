import React from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Clock, ShieldCheck, ArrowLeft, Phone } from "lucide-react";
import Link from "next/link";
import { specialitySeoSlugs } from "@/data/seoSlugMap";
import { services as localServices } from "@/data/services";
import ServiceBookingCTA from "@/components/departments/ServiceBookingCTA";
import { getDepartmentDataFromDB } from "@/lib/getDepartmentImage";
import type { Metadata } from "next";

export const revalidate = 0; // Ensure fresh data from Supabase on every request

function getServiceData(slug: string) {
  const seoEntry = specialitySeoSlugs[slug];
  if (!seoEntry) return null;
  const s = localServices.find((x) => x.id === seoEntry.dataSlug);
  if (!s) return null;
  return {
    seoEntry,
    title: s.title,
    summary: s.description,
    content: s.content || s.description,
    features: s.features || [],
    image: s.image,
    category: s.category,
  };
}

export async function generateStaticParams() {
  return Object.keys(specialitySeoSlugs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = getServiceData(slug);
  if (!data) return {};
  const { seoEntry } = data;
  
  const dbData = await getDepartmentDataFromDB(seoEntry.dataSlug);
  const title = dbData?.name || seoEntry.metaTitle;

  return {
    title: title,
    description: seoEntry.metaDescription,
    keywords: [seoEntry.primaryKeyword, ...seoEntry.secondaryKeywords],
    alternates: { canonical: `https://balajihospitaljaipur.com/speciality/${slug}` },
    openGraph: {
      title: seoEntry.metaTitle,
      description: seoEntry.metaDescription,
      url: `https://balajihospitaljaipur.com/speciality/${slug}`,
    },
    twitter: { card: "summary_large_image", title: seoEntry.metaTitle, description: seoEntry.metaDescription },
  };
}

const parseInline = (text: string) =>
  text.split(/(\*\*.*?\*\*)/).map((p, i) =>
    p.startsWith("**") && p.endsWith("**")
      ? <strong key={i} className="text-slate-900 font-bold">{p.slice(2, -2)}</strong>
      : p
  );

export default async function SpecialityServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getServiceData(slug);
  if (!data) notFound();
  const { seoEntry, summary, features, category } = data;
  // Prefer the content set via admin panel (Supabase), fall back to local data
  const dbData = await getDepartmentDataFromDB(data.seoEntry.dataSlug);
  const image = dbData?.image || data.image;
  const content = dbData?.overview || data.content;
  const title = dbData?.name || data.title;
  const h1 = dbData?.name || seoEntry.h1;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: seoEntry.h1,
    description: seoEntry.metaDescription,
    url: `https://balajihospitaljaipur.com/speciality/${slug}`,
    provider: {
      "@type": "Hospital",
      name: "Balaji Hospital & Orthopaedic Centre",
      url: "https://balajihospitaljaipur.com",
      telephone: "+91-7276229049",
    },
    mainEntityOfPage: {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `Where can I get the best ${seoEntry.primaryKeyword}?`,
          acceptedAnswer: { "@type": "Answer", text: `Balaji Hospital in Jaipur provides the best ${seoEntry.primaryKeyword}. Our specialists use the latest minimally invasive techniques for safe and effective treatment with faster recovery.` },
        },
        {
          "@type": "Question",
          name: `How to book an appointment for ${title} in Jaipur?`,
          acceptedAnswer: { "@type": "Answer", text: `Call +91 7276229049 or book online at balajihospitaljaipur.com/appointment. Our team is available 24/7 for emergencies.` },
        },
        {
          "@type": "Question",
          name: `What is the success rate of ${title} at Balaji Hospital?`,
          acceptedAnswer: { "@type": "Answer", text: `Balaji Hospital has a very high success rate for ${title} with 50,000+ procedures performed since 1996. Our expert surgical team ensures the best outcomes with minimal complications.` },
        },
      ],
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://balajihospitaljaipur.com" },
        { "@type": "ListItem", position: 2, name: "Speciality", item: "https://balajihospitaljaipur.com/speciality" },
        { "@type": "ListItem", position: 3, name: seoEntry.h1, item: `https://balajihospitaljaipur.com/speciality/${slug}` },
      ],
    },
  };

  return (
    <main className="pt-24 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-gradient-to-br from-purple-50 via-white to-slate-50 py-16 mb-16 border-b border-slate-100">
        <Container>
          <div className="max-w-3xl">
            <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-6 uppercase tracking-widest flex-wrap">
              <Link href="/" className="hover:text-purple-600 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/speciality" className="hover:text-purple-600 transition-colors">Speciality</Link>
              <span>/</span>
              <span className="text-purple-600">{seoEntry.h1}</span>
            </nav>
            <Link href="/speciality" className="inline-flex items-center gap-2 text-purple-600 font-bold mb-6 hover:gap-3 transition-all text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to Speciality Services
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-poppins leading-tight">
              {h1}
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed font-medium">{summary}</p>
            <div className="flex flex-wrap gap-2 mt-6">
              <span className="px-3 py-1 bg-purple-50 border border-purple-100 rounded-full text-xs font-semibold text-purple-700">{seoEntry.primaryKeyword}</span>
              {seoEntry.secondaryKeywords.map((kw) => (
                <span key={kw} className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-semibold text-slate-600">{kw}</span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl bg-slate-100">
              <Image src={image} alt={`${seoEntry.h1} - Balaji Hospital Jaipur`} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
              <div className="absolute bottom-6 left-8">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-xs font-bold uppercase tracking-widest">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Expert Speciality Care at Balaji Hospital
                </span>
              </div>
            </div>

            {/* Overview */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-6 font-poppins">Overview</h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-6">
                {content.split("\n\n").filter(chunk => chunk.trim().length > 0).map((chunk, i) => {
                  const cleanChunk = chunk.trim();
                  if (cleanChunk.startsWith("### "))
                    return (
                      <h3 key={i} className="text-xl font-bold text-slate-900 mt-8 mb-4 font-poppins border-l-4 border-purple-600 pl-4">
                        {parseInline(cleanChunk.replace("### ", ""))}
                      </h3>
                    );
                  if (cleanChunk.startsWith("- "))
                    return (
                      <ul key={i} className="list-disc pl-5 space-y-2">
                        {cleanChunk.split("\n").filter(li => li.trim().length > 0).map((li, li_i) => (
                          <li key={li_i}>{parseInline(li.trim().replace("- ", ""))}</li>
                        ))}
                      </ul>
                    );
                  return <p key={i}>{parseInline(cleanChunk)}</p>;
                })}
              </div>
            </section>

            {features.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-8 font-poppins">Key Treatments &amp; Services</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 p-5 bg-white rounded-2xl border border-slate-100 hover:border-purple-200 hover:shadow-md transition-all group">
                      <div className="w-8 h-8 bg-purple-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-purple-600 transition-colors">
                        <CheckCircle2 className="w-4 h-4 text-purple-600 group-hover:text-white transition-colors" />
                      </div>
                      <span className="font-semibold text-slate-700 text-sm leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-5 font-poppins">Why Choose Balaji Hospital?</h3>
                <ul className="space-y-3">
                  {["Expert specialist surgeons", "Minimally invasive techniques", "50,000+ successful procedures", "State-of-the-art operation theatres", "24/7 emergency services"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 bg-purple-600 rounded-3xl text-white">
                <h3 className="text-xs font-bold mb-5 flex items-center gap-3 text-purple-100 uppercase tracking-widest">
                  <ShieldCheck className="w-5 h-5" /> Quality Assurance
                </h3>
                <p className="text-purple-50 leading-relaxed text-sm mb-4">
                  We follow international surgical protocols with certified equipment and experienced specialists
                  ensuring the highest standards of care and patient safety.
                </p>
                <p className="text-purple-100 text-xs font-semibold">Serving Jaipur &amp; Rajasthan since 1996</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 font-poppins">Related Services</h2>
              <div className="flex flex-wrap gap-3">
                <Link href="/orthopedic" className="px-4 py-2 bg-medical-50 border border-medical-100 rounded-full text-sm font-semibold text-medical-700 hover:bg-medical-600 hover:text-white transition-colors">
                  Best Orthopedic Hospital in Jaipur
                </Link>
                <Link href="/ent" className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-sm font-semibold text-blue-700 hover:bg-blue-600 hover:text-white transition-colors">
                  ENT Specialist in Jaipur
                </Link>
                <Link href="/orthopedic/best-knee-replacement-hospital-in-jaipur" className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-900 hover:text-white transition-colors">
                  Knee Replacement in Jaipur
                </Link>
              </div>
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28">
            <ServiceBookingCTA serviceName={seoEntry.h1} category={category} />
            <div className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">Direct Contact</h3>
              <a href="tel:+917276229049" className="flex items-center gap-3 text-slate-600 hover:text-purple-600 transition-colors font-semibold mb-3">
                <Phone className="w-4 h-4 text-purple-500" /> +91 7276229049
              </a>
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                <Clock className="w-3.5 h-3.5" /> 24/7 Emergency Available
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
}
