import React from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";
import Link from "next/link";
import { CheckCircle2, Award, Heart, ShieldCheck, Clock } from "lucide-react";
import AboutCTA from "@/components/about/AboutCTA";

export const metadata = {
  title: "About Us | Balaji Hospital & Orthopaedic Centre Jaipur",
  description:
    "Founded in 1996, Balaji Hospital & Orthopaedic Centre, Jaipur provides best-in-class orthopedic, ENT, and speciality care. Learn about our history, mission, values, and team.",
};

const milestones = [
  { year: "1996", event: "Founded by Dr. Ramesh Agarwal, inaugurated by Pujya Shri Narayan Das ji Maharaj" },
  { year: "2002", event: "Expanded to include a fully equipped ENT department" },
  { year: "2008", event: "Established the Physiotherapy & Rehabilitation Centre" },
  { year: "2015", event: "Introduced Digital X-Ray and advanced diagnostic imaging" },
  { year: "2019", event: "Launched the Plastic & Vascular Surgery department" },
  { year: "2024", event: "28+ years of trusted orthopaedic and ENT excellence" },
];

const values = [
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Compassionate Care",
    description: "Every patient is treated with dignity, empathy, and individual attention.",
    color: "bg-red-50 text-red-600",
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Clinical Excellence",
    description: "Our specialists use evidence-based protocols and cutting-edge techniques.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Patient Safety",
    description: "Stringent infection control and surgical safety standards maintained at all times.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "24/7 Availability",
    description: "Emergency and trauma care is available around the clock, 365 days a year.",
    color: "bg-blue-50 text-blue-600",
  },
];

const stats = [
  { value: "28+", label: "Years of Service" },
  { value: "100+", label: "Patient Beds" },
  { value: "50,000+", label: "Patients Treated" },
  { value: "4", label: "Senior Specialists" },
];

const AboutPage = () => {
  return (
    <main className="pt-24 pb-16">
      {/* Page Hero */}
      <section className="bg-medical-50 py-16 mb-16">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-poppins">
              About Balaji Hospital
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Serving the people of Jaipur and surrounding districts since 1996 with expert orthopaedic, ENT, and speciality healthcare — at affordable cost.
            </p>
          </div>
        </Container>
      </section>

      <Container>
        {/* Story & Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="relative">
            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-medical-500/10">
              <Image
                src="https://balajihospitaljaipur.com/uploads/gallery/5965221775reception1-small.png"
                alt="Balaji Hospital Reception — Jaipur"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-medical-600 text-white p-8 rounded-3xl shadow-xl">
              <div className="text-4xl font-bold">1996</div>
              <div className="text-sm font-semibold text-medical-200 uppercase tracking-wider mt-1">
                Established
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-medical-600 font-bold text-xs uppercase tracking-widest">
              <span className="w-8 h-0.5 bg-medical-600" />
              Our Story
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-poppins leading-tight">
              The Best Care for You and Your Family
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                Balaji Hospital & Orthopaedic Centre was inaugurated by Pujya Shri Narayan Das ji Maharaj
                on 22nd February 1996, with a clear mission: to provide the best and most affordable
                orthopaedic care to all sections of society in Jaipur and Rajasthan.
              </p>
              <p>
                Founded by <strong>Dr. Ramesh Agarwal</strong>, a Gold Medallist orthopaedic surgeon, the
                hospital quickly grew from a single-specialty clinic into a comprehensive multispecialty
                centre. Today, it is recognised as the best orthopaedic and ENT hospital in Jaipur, backed
                by a team of experienced surgeons, dedicated nurses, and state-of-the-art facilities.
              </p>
              <p>
                We believe that complete in-house healthcare — from diagnostics to surgery to
                rehabilitation — reduces patient burden and accelerates recovery. Every department under
                one roof, with one unified team working towards your healing.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { icon: <CheckCircle2 className="w-5 h-5 text-medical-600" />, text: "100% In-house Care" },
                { icon: <CheckCircle2 className="w-5 h-5 text-medical-600" />, text: "Senior Consultants" },
                { icon: <CheckCircle2 className="w-5 h-5 text-medical-600" />, text: "24/7 Emergency" },
                { icon: <CheckCircle2 className="w-5 h-5 text-medical-600" />, text: "Affordable Pricing" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-semibold text-slate-700 text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="text-center p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="text-4xl font-bold text-medical-600 mb-2">{stat.value}</div>
              <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white mb-24 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-medical-400 font-bold text-xs uppercase tracking-widest mb-6">
              <span className="w-8 h-0.5 bg-medical-400" />
              Our Mission
              <span className="w-8 h-0.5 bg-medical-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 font-poppins">
              Committed to Your Health & Recovery
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              To deliver high-quality, compassionate medical services at affordable costs — ensuring that
              every patient, regardless of background, receives the best clinical outcomes and the dignity
              they deserve. We measure our success not by revenue, but by the health and happiness of
              those we serve.
            </p>
          </div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-medical-500/10 rounded-full -ml-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent-500/10 rounded-full -mr-16 -mb-16 blur-3xl" />
        </div>

        {/* Values */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-900 font-poppins mb-4">Our Core Values</h2>
            <p className="text-slate-600">
              Four principles that guide everything we do at Balaji Hospital.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div
                key={i}
                className="p-8 bg-white rounded-[2.5rem] border border-slate-100 hover:shadow-xl transition-all group"
              >
                <div
                  className={`w-16 h-16 ${value.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 font-poppins">
                  {value.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-900 font-poppins mb-4">
              Our Journey
            </h2>
            <p className="text-slate-600">28+ years of growth, innovation, and patient trust.</p>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 hidden md:block" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={i} className="flex items-start gap-6 md:gap-12 pl-0 md:pl-20 relative">
                  <div className="hidden md:flex absolute left-0 w-16 h-16 bg-medical-600 text-white rounded-2xl items-center justify-center font-bold text-sm shrink-0 shadow-lg shadow-medical-500/20">
                    {m.year}
                  </div>
                  <div className="flex md:hidden w-16 h-16 bg-medical-600 text-white rounded-2xl items-center justify-center font-bold text-sm shrink-0 shadow-lg">
                    {m.year}
                  </div>
                  <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm flex-grow hover:border-medical-200 transition-all">
                    <p className="text-slate-700 font-semibold">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <AboutCTA />
      </Container>
    </main>
  );
};

export default AboutPage;
