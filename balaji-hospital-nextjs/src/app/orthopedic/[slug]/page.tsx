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

export const revalidate = 60; // Revalidate every 60s to pick up new DB services

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

/** Fetch a service directly from Supabase DB (for admin-created services not in seoSlugMap) */
async function getDbServiceBySlug(slug: string) {
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data, error } = await supabase
      .from("departments")
      .select("id, slug, name, description, overview, image, category, meta_title, meta_description, is_active")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();
    if (error || !data) return null;
    return data as {
      id: string;
      slug: string;
      name: string;
      description: string | null;
      overview: string | null;
      image: string | null;
      category: string | null;
      meta_title: string | null;
      meta_description: string | null;
      is_active: boolean;
    };
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  // Include both static SEO slugs AND any DB-sourced orthopedic slugs
  const staticSlugs = Object.keys(orthopedicSeoSlugs).map((slug) => ({ slug }));
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await supabase
      .from("departments")
      .select("slug")
      .eq("is_active", true)
      .or("category.eq.orthopedic,category.eq.Orthopedic");
    const dbSlugs = (data || []).map((d: { slug: string }) => ({ slug: d.slug }));
    const allSlugs = [...staticSlugs, ...dbSlugs.filter((d) => !orthopedicSeoSlugs[d.slug])];
    return allSlugs;
  } catch {
    return staticSlugs;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = getServiceData(slug);
  
  // For static SEO slugs
  if (data) {
    const { seoEntry } = data;
    const dbData = await getDepartmentDataFromDB(seoEntry.dataSlug);
    const title = dbData?.meta_title || dbData?.name || seoEntry.metaTitle;
    const description = dbData?.meta_description || seoEntry.metaDescription;
    return {
      title,
      description,
      keywords: [seoEntry.primaryKeyword, ...seoEntry.secondaryKeywords],
      alternates: { canonical: `https://balajihospitaljaipur.com/orthopedic/${slug}` },
      openGraph: { title: seoEntry.metaTitle, description: seoEntry.metaDescription, url: `https://balajihospitaljaipur.com/orthopedic/${slug}` },
      twitter: { card: "summary_large_image", title: seoEntry.metaTitle, description: seoEntry.metaDescription },
    };
  }

  // For DB-only slugs (admin-created)
  const dbService = await getDbServiceBySlug(slug);
  if (dbService) {
    const title = dbService.meta_title || `${dbService.name} | Balaji Hospital Jaipur`;
    const description = dbService.meta_description || dbService.description || `Expert ${dbService.name} treatment at Balaji Hospital Jaipur since 1996.`;
    return {
      title,
      description,
      alternates: { canonical: `https://balajihospitaljaipur.com/orthopedic/${slug}` },
      openGraph: { title, description, url: `https://balajihospitaljaipur.com/orthopedic/${slug}` },
    };
  }

  return {};
}


export default async function OrthopedicServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getServiceData(slug);

  // ── DB-only service (admin-created, not in seoSlugMap) ──
  if (!data) {
    const dbService = await getDbServiceBySlug(slug);
    if (!dbService) notFound();

    const content = dbService.overview || dbService.description || "";
    const image = dbService.image || "/images/gallery/ot.png";

    return (
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="bg-gradient-to-br from-medical-50 via-white to-slate-50 py-16 mb-16 border-b border-slate-100">
          <Container>
            <div className="max-w-3xl">
              <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-6 uppercase tracking-widest flex-wrap">
                <Link href="/" className="hover:text-medical-600 transition-colors">Home</Link>
                <span>/</span>
                <Link href="/orthopedic" className="hover:text-medical-600 transition-colors">Orthopedic</Link>
                <span>/</span>
                <span className="text-medical-600">{dbService.name}</span>
              </nav>
              <Link href="/orthopedic" className="inline-flex items-center gap-2 text-medical-600 font-bold mb-6 hover:gap-3 transition-all text-sm">
                <ArrowLeft className="w-4 h-4" /> Back to Orthopedic Services
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-poppins leading-tight">{dbService.name}</h1>
              {dbService.description && (
                <p className="text-lg text-slate-600 leading-relaxed font-medium">{dbService.description}</p>
              )}
            </div>
          </Container>
        </section>

        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {/* Hero Image */}
              <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl bg-slate-100">
                <Image src={image} alt={`${dbService.name} - Balaji Hospital Jaipur`} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
                <div className="absolute bottom-6 left-8">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-xs font-bold uppercase tracking-widest">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Expert Care at Balaji Hospital
                  </span>
                </div>
              </div>

              {content && (
                <section>
                  <h2 className="text-3xl font-bold text-slate-900 mb-6 font-poppins">Overview</h2>
                  <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-p:text-slate-600 prose-headings:text-slate-900 prose-headings:font-bold">
                    {content.trim().startsWith("<") ? (
                      <div dangerouslySetInnerHTML={{ __html: content }} />
                    ) : (
                      content.split("\n\n").filter((c: string) => c.trim()).map((chunk: string, i: number) => (
                        <p key={i}>{chunk.trim()}</p>
                      ))
                    )}
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
                  <p className="text-medical-50 leading-relaxed text-sm">
                    We follow strict international protocols for surgical safety and hygiene. All implants are internationally certified, sourced from leading global manufacturers.
                  </p>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-28">
              <ServiceBookingCTA serviceName={dbService.name} category={dbService.category || "Orthopedic"} />
              <div className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">Direct Contact</h3>
                <a href="tel:+917276229049" className="flex items-center gap-3 text-slate-600 hover:text-medical-600 transition-colors font-semibold mb-3">
                  <Phone className="w-4 h-4 text-medical-500" /> +91 7276229049
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

  // ── Existing static (SEO) slug path below ──

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
              <div className="prose prose-slate prose-medical max-w-none prose-p:leading-relaxed prose-p:text-slate-600 prose-headings:text-slate-900 prose-headings:font-bold prose-a:text-medical-600 prose-a:font-bold prose-strong:text-slate-900 prose-em:text-slate-700">
                {content.trim().startsWith("<") ? (
                  <div dangerouslySetInnerHTML={{ __html: content }} />
                ) : (
                  content.split("\n\n").filter((chunk: string) => chunk.trim().length > 0).map((chunk: string, i: number) => {
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
                          {cleanChunk.split("\n").filter((li: string) => li.trim().length > 0).map((li: string, li_i: number) => (
                            <li key={li_i}>{parseMarkdownInline(li.trim().replace("- ", ""))}</li>
                          ))}
                        </ul>
                      );
                    return <p key={i}>{parseMarkdownInline(cleanChunk)}</p>;
                  })
                )}
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
