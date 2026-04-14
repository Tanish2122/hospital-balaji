import React from "react";
import Container from "@/components/ui/Container";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { services as localServices } from "@/data/services";
import { otherDataToSeoSlug } from "@/data/seoSlugMap";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Other Specialised Departments in Jaipur | Urology & Surgery | Balaji Hospital",
  description:
    "Other specialised care in Jaipur — expert kidney stone treatment, plastic & vascular surgery. Advanced urology & surgical solutions at Balaji Hospital since 1996.",
  keywords: [
    "speciality hospital jaipur",
    "kidney stone treatment jaipur",
    "urologist in jaipur",
    "plastic surgery jaipur",
    "vascular surgeon jaipur",
  ],
  alternates: { canonical: "https://balajihospitaljaipur.com/speciality" },
  openGraph: {
    title: "Other Specialised Departments in Jaipur | Balaji Hospital",
    description: "Expert urology, plastic & vascular surgery in Jaipur. Advanced care since 1996.",
    url: "https://balajihospitaljaipur.com/speciality",
  },
};

const specialityServices = localServices.filter((s) => s.category === "Other");

export default function SpecialityPage() {
  return (
    <main className="pt-24 pb-16">
      <section className="bg-gradient-to-br from-purple-50 via-white to-slate-50 py-20 mb-16 border-b border-slate-100">
        <Container>
          <div className="max-w-3xl">
            <span className="inline-flex px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border bg-purple-50 border-purple-200 text-purple-700 mb-6">
              Other Specialised Services
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-poppins">
              Other Specialised Departments
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Balaji Hospital offers expert multi-speciality care in Jaipur including advanced urology (kidney stones),
              plastic surgery, and vascular surgery. Our specialist surgical team delivers expert solutions for complex
              medical needs under one roof.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                href="/appointment"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-full font-bold hover:bg-purple-700 transition-colors"
              >
                Book Appointment <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:+917276229049"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-full font-bold hover:bg-purple-50 transition-colors"
              >
                Call: +91 7276229049
              </a>
            </div>
          </div>
        </Container>
      </section>

      <Container>
        <h2 className="text-2xl font-bold text-slate-900 mb-8 font-poppins">Our Specialised Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {specialityServices.map((svc) => {
            const seoSlug = otherDataToSeoSlug[svc.id];
            const href = seoSlug ? `/speciality/${seoSlug}` : `/departments/other/${svc.id}`;
            return (
              <Link
                key={svc.id}
                href={href}
                className="group p-8 bg-white rounded-[2.5rem] border border-slate-100 hover:border-purple-300 transition-all hover:shadow-2xl flex flex-col hover:-translate-y-1 duration-300"
              >
                <h2 className="text-xl font-bold text-slate-900 mb-3 font-poppins group-hover:text-purple-600 transition-colors">
                  {svc.title}
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">{svc.description}</p>
                {svc.features && (
                  <ul className="mb-6 space-y-1">
                    {svc.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-500 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="inline-flex items-center gap-2 font-bold text-purple-600 text-sm group-hover:gap-4 transition-all">
                  Explore Treatment <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6 font-poppins">Related Services</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Best Orthopedic Hospital in Jaipur", href: "/orthopedic" },
              { label: "ENT Specialist in Jaipur", href: "/ent" },
              { label: "Book Appointment", href: "/appointment" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 bg-purple-50 border border-purple-100 rounded-full text-sm font-semibold text-purple-700 hover:bg-purple-600 hover:text-white transition-colors"
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
