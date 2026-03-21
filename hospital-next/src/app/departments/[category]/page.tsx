import React from "react";
import Container from "@/components/ui/Container";
import { services } from "@/data/services";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

type CategoryParam = "orthopedic" | "ent" | "speciality";

const categoryMeta: Record<
  CategoryParam,
  { label: string; value: string; description: string; color: string }
> = {
  orthopedic: {
    label: "Orthopedic Department",
    value: "Orthopedic",
    description:
      "Balaji Hospital is Jaipur's leading orthopaedic care centre. Our senior surgeons specialise in joint replacement, spine surgery, fracture management, sports medicine, and paediatric orthopaedics — offering both surgical and non-surgical solutions.",
    color: "bg-amber-50 border-amber-200 text-amber-700",
  },
  ent: {
    label: "ENT Department",
    value: "ENT",
    description:
      "Our ENT department provides comprehensive care for ear, nose, and throat disorders. Using advanced endoscopic and microscopic techniques, our specialists treat everything from chronic ear infections to nasal polyps and voice disorders.",
    color: "bg-blue-50 border-blue-200 text-blue-700",
  },
  speciality: {
    label: "Speciality Department",
    value: "Speciality",
    description:
      "Beyond orthopaedics and ENT, our speciality department handles complex cases including kidney stone treatment, plastic and vascular surgery, and other multi-disciplinary procedures requiring expert care.",
    color: "bg-purple-50 border-purple-200 text-purple-700",
  },
};

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
    title: `${meta.label} | Balaji Hospital Jaipur`,
    description: meta.description,
  };
}

const DepartmentCategoryPage = async ({
  params,
}: {
  params: Promise<{ category: string }>;
}) => {
  const { category } = await params;
  const meta = categoryMeta[category as CategoryParam];
  if (!meta) notFound();

  const categoryServices = services.filter(
    (s) => s.category.toLowerCase() === category.toLowerCase()
  );

  return (
    <main className="pt-24 pb-16">
      {/* Hero */}
      <section className="bg-medical-50 py-16 mb-16">
        <Container>
          <div className="max-w-3xl">
            <span
              className={`inline-flex px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border mb-4 ${meta.color}`}
            >
              {meta.label}
            </span>
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
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {categoryServices.map((service) => (
            <div
              key={service.id}
              className="group p-8 bg-white rounded-[2.5rem] border border-slate-100 hover:border-medical-200 transition-all hover:shadow-2xl hover:shadow-medical-100 flex flex-col"
            >
              <div className="w-16 h-16 bg-medical-50 rounded-2xl flex items-center justify-center mb-8 text-medical-600 group-hover:bg-medical-600 group-hover:text-white transition-all duration-500">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-4 font-poppins group-hover:text-medical-600 transition-colors">
                {service.title}
              </h2>
              <p className="text-slate-600 leading-relaxed mb-8 flex-grow">
                {service.description}
              </p>
              <Link
                href={service.url}
                className="inline-flex items-center gap-2 font-bold text-medical-600 group-hover:gap-4 transition-all"
              >
                Explore Treatment
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ))}
        </div>

        {/* CTA */}
        <section className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4 font-poppins">
                Book a Consultation
              </h2>
              <p className="text-slate-400 text-lg mb-8">
                Our {meta.label.replace(" Department", "")} specialists are
                available 6 days a week. Contact us to schedule your
                appointment.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-medical-600 text-white rounded-2xl font-bold hover:bg-medical-700 transition-all shadow-xl"
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
            <div className="hidden lg:flex flex-col gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="text-3xl font-bold text-medical-400 mb-1">
                  25+
                </div>
                <div className="text-slate-400 text-sm">
                  Years of Excellence
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="text-3xl font-bold text-accent-400 mb-1">
                  24/7
                </div>
                <div className="text-slate-400 text-sm">Emergency Services</div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-medical-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        </section>

        {/* Back link */}
        <div className="mt-12 text-center">
          <Link
            href="/departments"
            className="inline-flex items-center gap-2 font-bold text-slate-500 hover:text-medical-600 transition-colors"
          >
            ← View All Departments
          </Link>
        </div>
      </Container>
    </main>
  );
};

export default DepartmentCategoryPage;
