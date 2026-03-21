import React from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";
import { services } from "@/data/services";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Stethoscope, Clock, ShieldCheck } from "lucide-react";
import Link from "next/link";

export async function generateStaticParams(): Promise<{ category: string; slug: string }[]> {
  const params: { category: string; slug: string }[] = [];
  services.forEach((service) => {
    // Extract category and slug from url: "/departments/orthopedic/spine-treatment"
    const parts = service.url.split("/");
    if (parts.length >= 4) {
      params.push({
        category: parts[2],
        slug: parts[3],
      });
    }
  });
  return params;
}

const ServiceDetailPage = async ({ params }: { params: Promise<{ category: string; slug: string }> }) => {
  const { slug } = await params;
  const service = services.find((s) => s.url.endsWith(slug));

  if (!service) {
    notFound();
  }

  return (
    <main className="pt-24 pb-16">
      <section className="bg-medical-50 py-16 mb-16">
        <Container>
          <div className="max-w-3xl">
            <nav className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-6 uppercase tracking-widest">
              <Link href="/departments" className="hover:text-medical-600">Departments</Link>
              <span>/</span>
              <span className="text-medical-600">{service.category}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-poppins">
              {service.title}
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              Advanced {service.title} procedures and care at Balaji Hospital Jaipur.
            </p>
          </div>
        </Container>
      </section>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div className="relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
              />
            </div>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-6 font-poppins">Overview</h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-6">
                <p>{service.description}</p>
                <p>
                  At Balaji Hospital, our {service.category} department is equipped with state-of-the-art diagnostic and 
                  therapeutic technologies. We specialize in providing minimally invasive surgical solutions that 
                  ensure faster recovery times and better patient outcomes.
                </p>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6 font-poppins flex items-center gap-3">
                  <Stethoscope className="w-6 h-6 text-medical-600" />
                  Key Features
                </h3>
                <ul className="space-y-4 font-semibold text-slate-700">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-medical-500" /> Modern Equipment
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-medical-500" /> Expert Surgeons
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-medical-500" /> Personalised Care
                  </li>
                </ul>
              </div>
              <div className="p-8 bg-medical-600 rounded-3xl text-white">
                <h3 className="text-xl font-bold mb-6 font-poppins flex items-center gap-3 text-medical-100 uppercase tracking-widest text-xs">
                  <ShieldCheck className="w-5 h-5" /> Quality Assurance
                </h3>
                <p className="text-medical-50 leading-relaxed">
                  We follow strict international protocols for safety and hygiene to provide the best 
                  medical environment for our patients.
                </p>
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 font-poppins">Book Treatment</h3>
              <p className="text-slate-500 mb-8 text-sm">
                Schedule a consultation with our specialized surgeons today.
              </p>
              <Link
                href="/contact"
                className="w-full py-4 bg-medical-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-medical-700 transition-all mb-4 shadow-lg shadow-medical-100"
              >
                Inquire Now
              </Link>
              <div className="pt-4 border-t border-slate-50 flex items-center gap-3 text-slate-400 text-sm italic">
                <Clock className="w-4 h-4" /> Available 24/7 for Emergencies
              </div>
            </div>

            <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white">
              <h3 className="text-xl font-bold mb-6 font-poppins text-accent-400">Other Services</h3>
              <ul className="space-y-4">
                {services.slice(0, 5).filter(s => s.id !== service.id).map(s => (
                  <li key={s.id}>
                    <Link href={s.url} className="text-slate-400 hover:text-white transition-colors flex items-center justify-between group">
                      {s.title}
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
};

export default ServiceDetailPage;
