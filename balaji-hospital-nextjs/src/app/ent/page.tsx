import React from "react";
import Container from "@/components/ui/Container";
import { ArrowRight, CheckCircle2, Wind } from "lucide-react";
import Link from "next/link";
import { services as localServices } from "@/data/services";
import { entDataToSeoSlug } from "@/data/seoSlugMap";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best ENT Hospital in Jaipur | ENT Specialist | Balaji Hospital",
  description:
    "Top ENT specialist hospital in Jaipur. Advanced endoscopic ear, nose & throat surgery by Dr. Saloni Agarwal. Expert sinus, tonsil & hearing care since 1996. Book now.",
  keywords: [
    "ENT specialist in jaipur",
    "best ENT hospital jaipur",
    "ear surgery jaipur",
    "nose surgery jaipur",
    "throat surgery jaipur",
  ],
  alternates: { canonical: "https://balajihospitaljaipur.com/ent" },
  openGraph: {
    title: "Best ENT Hospital in Jaipur | Balaji Hospital",
    description: "Expert ENT care in Jaipur. Advanced ear, nose & throat surgery by senior specialists since 1996.",
    url: "https://balajihospitaljaipur.com/ent",
  },
};

const entServices = localServices.filter((s) => s.category === "ENT");

export default function ENTPage() {
  return (
    <main className="pt-24 pb-16">
      <section className="bg-gradient-to-br from-blue-50 via-white to-slate-50 py-20 mb-16 border-b border-slate-100">
        <Container>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border bg-blue-50 border-blue-200 text-blue-700">
                ENT Department
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-poppins">
              Best ENT Hospital in Jaipur
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Balaji Hospital is Jaipur's top ENT specialist hospital. Led by Dr. Saloni Agarwal (MS ENT), we provide
              advanced endoscopic sinus surgery, microscopic ear surgery, and expert throat care. Trusted by thousands
              of patients across Rajasthan since 1996.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                href="/appointment"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors"
              >
                Book Appointment <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:+917276229049"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-full font-bold hover:bg-blue-50 transition-colors"
              >
                Call: +91 7276229049
              </a>
            </div>
          </div>
        </Container>
      </section>

      <Container>
        <h2 className="text-2xl font-bold text-slate-900 mb-8 font-poppins">Our ENT Services in Jaipur</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {entServices.map((svc) => {
            const seoSlug = entDataToSeoSlug[svc.id];
            const href = seoSlug ? `/ent/${seoSlug}` : `/departments/ent/${svc.id}`;
            return (
              <Link
                key={svc.id}
                href={href}
                className="group p-8 bg-white rounded-[2.5rem] border border-slate-100 hover:border-blue-300 transition-all hover:shadow-2xl flex flex-col hover:-translate-y-1 duration-300"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                  <Wind className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-3 font-poppins group-hover:text-blue-600 transition-colors">
                  {svc.title}
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">{svc.description}</p>
                <div className="inline-flex items-center gap-2 font-bold text-blue-600 text-sm group-hover:gap-4 transition-all">
                  Explore Treatment <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>

        <section className="bg-slate-900 rounded-[2.5rem] p-10 md:p-16 text-white mb-12">
          <h2 className="text-3xl font-bold mb-4 font-poppins">Why Choose Balaji Hospital for ENT?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {[
              "Senior ENT specialist — Dr. Saloni Agarwal MS (ENT)",
              "Advanced endoscopic & microscopic surgery",
              "State-of-the-art OT with modern ENT equipment",
              "Expert hearing restoration procedures",
              "Child-friendly ENT care",
              "Minimal downtime, faster recovery",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-slate-200 font-medium">
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6 font-poppins">Related Services</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Best Orthopedic Hospital in Jaipur", href: "/orthopedic" },
              { label: "Kidney Stones Treatment in Jaipur", href: "/speciality/kidney-stones-treatment-in-jaipur" },
              { label: "Book Appointment", href: "/appointment" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-sm font-semibold text-blue-700 hover:bg-blue-600 hover:text-white transition-colors"
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
