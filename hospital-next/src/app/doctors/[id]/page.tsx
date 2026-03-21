import React from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";
import { doctors } from "@/data/doctors";
import { notFound } from "next/navigation";
import { Phone, Mail, Award, CheckCircle2, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

export async function generateStaticParams() {
  return doctors.map((doctor) => ({
    id: doctor.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doctor = doctors.find((d) => d.id === id);
  if (!doctor) return {};
  return {
    title: `${doctor.name} | ${doctor.specialty} | Balaji Hospital Jaipur`,
    description: doctor.description.slice(0, 160),
  };
}

const DoctorDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const doctor = doctors.find((d) => d.id === id);

  if (!doctor) {
    notFound();
  }

  return (
    <main className="pt-24 pb-16">
      {/* Hero banner */}
      <section className="bg-medical-50 py-16 mb-16">
        <Container>
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 text-medical-600 font-bold mb-8 hover:gap-3 transition-all text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> All Doctors
          </Link>
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-end">
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-8 border-white shadow-xl shrink-0">
              <Image
                src={doctor.image}
                alt={doctor.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center md:text-left pb-4">
              <span className="text-medical-600 font-bold text-xs uppercase tracking-widest bg-white px-4 py-1.5 rounded-full mb-4 inline-block border border-medical-100">
                {doctor.department} Department
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2 font-poppins">
                {doctor.name}
              </h1>
              <p className="text-lg text-slate-600 font-medium">
                {doctor.specialty}
              </p>
              <p className="text-medical-600 font-bold mt-1">{doctor.experience} Experience</p>
            </div>
          </div>
        </Container>
      </section>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Bio */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-6 font-poppins">
                Professional Overview
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-lg">
                <p>{doctor.description}</p>
              </div>
            </section>

            {/* Qualifications + Schedule */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-medical-50 rounded-2xl flex items-center justify-center text-medical-600 mb-6">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 font-poppins">
                  Qualifications
                </h3>
                <ul className="space-y-3">
                  {doctor.qualifications.map((q, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600">
                      <CheckCircle2 className="w-5 h-5 text-medical-500 shrink-0 mt-0.5" />
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-accent-50 rounded-2xl flex items-center justify-center text-accent-600 mb-6">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 font-poppins">
                  Consultation Schedule
                </h3>
                <ul className="space-y-3">
                  {doctor.schedule.map((slot, i) => (
                    <li
                      key={i}
                      className={`flex justify-between text-sm font-semibold ${
                        slot.hours === "Closed" || slot.hours.includes("On Call")
                          ? "text-slate-400"
                          : "text-slate-700"
                      }`}
                    >
                      <span>{slot.days}</span>
                      <span>{slot.hours}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Services */}
            {doctor.services && doctor.services.length > 0 && (
              <section>
                <h3 className="text-2xl font-bold text-slate-900 mb-6 font-poppins">
                  Treatments & Specialisations
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {doctor.services.map((svc, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-4 bg-medical-50 rounded-2xl border border-medical-100"
                    >
                      <CheckCircle2 className="w-5 h-5 text-medical-600 shrink-0" />
                      <span className="font-semibold text-slate-700 text-sm">{svc}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white sticky top-32">
              <h3 className="text-2xl font-bold mb-2 font-poppins">
                Book Appointment
              </h3>
              <p className="text-slate-400 mb-8 text-sm leading-relaxed">
                Secure your consultation with {doctor.name} at Balaji Hospital, Jaipur.
              </p>
              <div className="space-y-3">
                <Link
                  href="/contact"
                  className="w-full py-4 bg-medical-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-medical-700 transition-all"
                >
                  Request Appointment
                </Link>
                <a
                  href="tel:+917276229049"
                  className="w-full py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
                >
                  <Phone className="w-5 h-5" /> +91 7276229049
                </a>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                <div className="flex gap-4">
                  <Mail className="w-5 h-5 text-medical-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-medical-400 uppercase tracking-widest mb-1">
                      Email
                    </div>
                    <a
                      href="mailto:info@balajihospitaljaipur.com"
                      className="text-slate-300 text-sm hover:text-white transition-colors break-all"
                    >
                      info@balajihospitaljaipur.com
                    </a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Phone className="w-5 h-5 text-medical-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-medical-400 uppercase tracking-widest mb-1">
                      Phone
                    </div>
                    <a
                      href="tel:+917276229049"
                      className="text-slate-300 text-sm hover:text-white transition-colors"
                    >
                      +91 7276229049
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
};

export default DoctorDetailPage;
