import React from "react";
import Container from "@/components/ui/Container";
import { services } from "@/data/services";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Departments & Services | Balaji Hospital & Orthopaedic Centre Jaipur",
  description:
    "Explore our full range of medical specialities: Orthopaedic (Spine, Knee, Hip), ENT (Ear, Nose, Throat), and Speciality care. Serving Jaipur since 1996.",
};

const DepartmentsPage = () => {
  return (
    <main className="pt-24 pb-16">
      <section className="bg-medical-50 py-16 mb-16">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-poppins">
              Medical Departments
            </h1>
            <p className="text-lg text-slate-600">
              Specialised care across orthopaedic, ENT, and surgical disciplines —
              using the latest minimally invasive techniques and state-of-the-art equipment.
            </p>
          </div>
        </Container>
      </section>

      <Container>
        <div className="space-y-24 mb-24">
          {[
            { label: "Orthopedic", slug: "orthopedic" },
            { label: "ENT", slug: "ent" },
            { label: "Speciality", slug: "speciality" },
          ].map(({ label, slug }) => (
            <div key={label}>
              <div className="flex items-center gap-4 mb-12">
                <div className="h-px bg-slate-200 flex-grow" />
                <h2 className="text-2xl font-bold text-slate-400 font-poppins uppercase tracking-widest flex items-center gap-3 whitespace-nowrap">
                  <span className="text-medical-600">{label}</span> Department
                </h2>
                <div className="h-px bg-slate-200 flex-grow" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {services
                  .filter((s) => s.category === label)
                  .map((service) => (
                    <div
                      key={service.id}
                      className="group p-8 bg-white rounded-[2.5rem] border border-slate-100 hover:border-medical-200 transition-all hover:shadow-2xl hover:shadow-medical-100 flex flex-col"
                    >
                      <div className="w-16 h-16 bg-medical-50 rounded-2xl flex items-center justify-center mb-8 text-medical-600 group-hover:bg-medical-600 group-hover:text-white transition-all duration-500">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-4 font-poppins group-hover:text-medical-600 transition-colors">
                        {service.title}
                      </h3>
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

              <div className="flex justify-end">
                <Link
                  href={`/departments/${slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-medical-50 border border-medical-200 text-medical-700 rounded-2xl font-bold hover:bg-medical-600 hover:text-white hover:border-medical-600 transition-all text-sm"
                >
                  View All {label} Treatments <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <section className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-bold mb-6 font-poppins">
              Can't find what you're looking for?
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              We offer several other specialised treatments not listed here.
              Contact our front desk for detailed enquiries.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-medical-600 text-white rounded-2xl font-bold hover:bg-medical-700 transition-all shadow-xl shadow-medical-900/40"
              >
                Contact Support
                <ArrowRight className="w-5 h-5" />
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
};

export default DepartmentsPage;
