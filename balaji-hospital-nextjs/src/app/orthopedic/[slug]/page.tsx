import React from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Stethoscope, Clock, ShieldCheck, ArrowLeft, Phone } from "lucide-react";
import Link from "next/link";
import { orthopedicSeoSlugs } from "@/data/seoSlugMap";
import { orthopedicServices } from "@/data/orthopedicServices";
import { services as localServices } from "@/data/services";
import ServiceBookingCTA from "@/components/departments/ServiceBookingCTA";
import { getDepartmentDataFromDB } from "@/lib/getDepartmentImage";
import { parseMarkdownInline } from "@/lib/markdown";
import type { Metadata } from "next";

export const revalidate = 0; // Ensure fresh data from Supabase on every request

function getServiceData(slug: string) {
  const seoEntry = orthopedicSeoSlugs[slug];
  if (!seoEntry) return null;

  if (seoEntry.dataCategory === "orthopedic") {
    const s = orthopedicServices.find((x) => x.slug === seoEntry.dataSlug);
    if (s)
      return {
        seoEntry,
        title: s.title,
        summary: s.summary,
        content: s.content,
        features: s.features,
        image: s.image,
        keywords: s.keywords,
        category: "Orthopedic",
      };
  }
  // Speciality fallback (e.g. plastic-vascular-surgery is under /orthopedic/ per the sheet)
  const s = localServices.find((x) => x.id === seoEntry.dataSlug);
  if (s)
    return {
      seoEntry,
      title: s.title,
      summary: s.description,
      content: s.content || s.description,
      features: s.features || [],
      image: s.image,
      keywords: [] as string[],
      category: s.category,
    };
  return null;
}

export async function generateStaticParams() {
  return Object.keys(orthopedicSeoSlugs).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
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
    alternates: {
      canonical: `https://balajihospitaljaipur.com/orthopedic/${slug}`,
    },
    openGraph: {
      title: seoEntry.metaTitle,
      description: seoEntry.metaDescription,
      url: `https://balajihospitaljaipur.com/orthopedic/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: seoEntry.metaTitle,
      description: seoEntry.metaDescription,
    },
  };
}


export default async function OrthopedicServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getServiceData(slug);
  if (!data) notFound();

  const { seoEntry, summary, features, keywords, category } = data;
  // Prefer the content set via admin panel (Supabase), fall back to local data
  const dbData = await getDepartmentDataFromDB(seoEntry.dataSlug);
  const image = dbData?.image || data.image;
  const content = dbData?.overview || data.content;
  const title = dbData?.name || data.title; // Dynamic name from CMS
  const h1 = dbData?.name || seoEntry.h1;    // Dynamic H1 from CMS

  // Sibling services (other orthopedic pages for sidebar)
  const siblings = Object.entries(orthopedicSeoSlugs)
    .filter(([s]) => s !== slug)
    .slice(0, 6)
    .map(([s, e]) => ({ slug: s, name: e.h1 }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: seoEntry.h1,
    description: seoEntry.metaDescription,
    url: `https://balajihospitaljaipur.com/orthopedic/${slug}`,
    provider: {
      "@type": "Hospital",
      name: "Balaji Hospital & Orthopaedic Centre",
      url: "https://balajihospitaljaipur.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "27, Ratan Nagar, Dher Ke Balaji, Sikar Road",
        addressLocality: "Jaipur",
        addressRegion: "Rajasthan",
        postalCode: "302039",
        addressCountry: "IN",
      },
      telephone: "+91-7276229049",
    },
    mainEntityOfPage: {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `What is the best hospital for ${seoEntry.primaryKeyword}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `Balaji Hospital & Orthopaedic Centre in Jaipur is one of the best hospitals for ${seoEntry.primaryKeyword}. With 50,000+ successful surgeries since 1996, our senior orthopedic surgeons provide expert care using advanced, minimally invasive techniques.`,
          },
        },
        {
          "@type": "Question",
          name: `How do I book an appointment for ${title} at Balaji Hospital?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `You can book an appointment online at balajihospitaljaipur.com/appointment or call us at +91 7276229049. Our team is available 24/7 for emergencies.`,
          },
        },
        {
          "@type": "Question",
          name: `Is ${title} available at Balaji Hospital Jaipur?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `Yes, ${title} is available at Balaji Hospital & Orthopaedic Centre, located at 27 Ratan Nagar, Sikar Road, Jaipur. We have senior specialists with 25+ years of experience.`,
          },
        },
      ],
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://balajihospitaljaipur.com" },
        { "@type": "ListItem", position: 2, name: "Orthopedic", item: "https://balajihospitaljaipur.com/orthopedic" },
        {
          "@type": "ListItem",
          position: 3,
          name: seoEntry.h1,
          item: `https://balajihospitaljaipur.com/orthopedic/${slug}`,
        },
      ],
    },
  };

  return (
    <main className="pt-24 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-medical-50 via-white to-slate-50 py-16 mb-16 border-b border-slate-100">
        <Container>
          <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-6 uppercase tracking-widest flex-wrap">
              <Link href="/" className="hover:text-medical-600 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/orthopedic" className="hover:text-medical-600 transition-colors">Orthopedic</Link>
              <span>/</span>
              <span className="text-medical-600">{seoEntry.h1}</span>
            </nav>

            <Link
              href="/orthopedic"
              className="inline-flex items-center gap-2 text-medical-600 font-bold mb-6 hover:gap-3 transition-all text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Orthopedic Services
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-poppins leading-tight">
              {h1}
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed font-medium">{summary}</p>

            {/* Keyword pills */}
            <div className="flex flex-wrap gap-2 mt-6">
              <span className="px-3 py-1 bg-medical-50 border border-medical-100 rounded-full text-xs font-semibold text-medical-700">
                {seoEntry.primaryKeyword}
              </span>
              {seoEntry.secondaryKeywords.map((kw) => (
                <span key={kw} className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-semibold text-slate-600">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Hero Image */}
            <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl bg-slate-100">
              <Image src={image} alt={`${seoEntry.h1} - Balaji Hospital Jaipur`} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
              <div className="absolute bottom-6 left-8">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-xs font-bold uppercase tracking-widest">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Expert Care at Balaji Hospital
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
                      <h3 key={i} className="text-xl font-bold text-slate-900 mt-8 mb-4 font-poppins border-l-4 border-medical-600 pl-4">
                        {parseMarkdownInline(cleanChunk.replace("### ", ""))}
                      </h3>
                    );
                  if (cleanChunk.startsWith("- "))
                    return (
                      <ul key={i} className="list-disc pl-5 space-y-2">
                        {cleanChunk.split("\n").filter(li => li.trim().length > 0).map((li, li_i) => (
                          <li key={li_i}>{parseMarkdownInline(li.trim().replace("- ", ""))}</li>
                        ))}
                      </ul>
                    );
                  return <p key={i}>{parseMarkdownInline(cleanChunk)}</p>;
                })}
              </div>
            </section>

            {/* Key Treatments */}
            {features.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-8 font-poppins">Key Treatments &amp; Services</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 p-5 bg-white rounded-2xl border border-slate-100 hover:border-medical-200 hover:shadow-md transition-all group">
                      <div className="w-8 h-8 bg-medical-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-medical-600 transition-colors">
                        <CheckCircle2 className="w-4 h-4 text-medical-600 group-hover:text-white transition-colors" />
                      </div>
                      <span className="font-semibold text-slate-700 text-sm leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Why Balaji */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-5 font-poppins flex items-center gap-3">
                  <Stethoscope className="w-6 h-6 text-medical-600" /> Why Choose Balaji Hospital?
                </h3>
                <ul className="space-y-3">
                  {["30+ years of orthopaedic excellence", "50,000+ successful surgeries", "Minimally invasive techniques", "State-of-the-art OT & ICU", "Dedicated physiotherapy centre"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4 text-medical-500 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 bg-medical-600 rounded-3xl text-white">
                <h3 className="text-xs font-bold mb-5 font-poppins flex items-center gap-3 text-medical-100 uppercase tracking-widest">
                  <ShieldCheck className="w-5 h-5" /> Quality Assurance
                </h3>
                <p className="text-medical-50 leading-relaxed text-sm mb-4">
                  We follow strict international protocols for surgical safety and hygiene. All implants are
                  internationally certified, sourced from leading global manufacturers.
                </p>
                <p className="text-medical-100 text-xs font-semibold">
                  Member: Indian Orthopaedic Association (IOA) · NABH standards
                </p>
              </div>
            </section>

            {/* Internal Links */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 font-poppins">Related Orthopedic Services</h2>
              <div className="flex flex-wrap gap-3">
                {siblings.slice(0, 5).map((s) => (
                  <Link
                    key={s.slug}
                    href={`/orthopedic/${s.slug}`}
                    className="px-4 py-2 bg-medical-50 border border-medical-100 rounded-full text-sm font-semibold text-medical-700 hover:bg-medical-600 hover:text-white transition-colors"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-28">
            <ServiceBookingCTA serviceName={seoEntry.h1} category={category} />

            <div className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">Direct Contact</h3>
              <a href="tel:+917276229049" className="flex items-center gap-3 text-slate-600 hover:text-medical-600 transition-colors font-semibold mb-3">
                <Phone className="w-4 h-4 text-medical-500" /> +91 7276229049
              </a>
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                <Clock className="w-3.5 h-3.5" /> 24/7 Emergency Available
              </div>
            </div>

            {siblings.length > 0 && (
              <div className="p-6 bg-slate-900 rounded-[2rem] text-white">
                <h3 className="text-sm font-bold mb-5 text-amber-400 uppercase tracking-widest">Related Services</h3>
                <ul className="space-y-3">
                  {siblings.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/orthopedic/${s.slug}`}
                        className="text-slate-400 hover:text-white transition-colors flex items-center justify-between group text-sm font-medium"
                      >
                        {s.name}
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all" />
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
}
