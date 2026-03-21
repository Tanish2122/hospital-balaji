import React from "react";
import Container from "@/components/ui/Container";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Ambulance, Cpu, ShieldCheck, Microscope, ArrowRight, Clock, Zap } from "lucide-react";

export const metadata = {
  title: "Hospital Facilities | Balaji Hospital & Orthopaedic Centre, Jaipur",
  description:
    "State-of-the-art facilities at Balaji Hospital Jaipur — modern OTs, digital X-ray, physiotherapy centre, 24/7 pharmacy, general wards, private rooms, and diagnostic imaging.",
};

const facilities = [
  {
    title: "Reception & OPD Area",
    image: "/images/gallery/reception.png",
    description:
      "Our bright, spacious reception area ensures a smooth OPD experience for patients and their families. Dedicated staff at the registration desk guide you through the consultation process.",
    badge: "Walk-ins Welcome",
  },
  {
    title: "Operation Theatres",
    image: "/images/gallery/ot.png",
    description:
      "Fully modular and sterilised OTs equipped for orthopaedic (spine, knee, hip), ENT, plastic, and vascular procedures. Laminar airflow systems ensure 100% infection-free surgical environment.",
    badge: "Modular OT",
  },
  {
    title: "Advanced OT Suite",
    image: "/images/gallery/ot2.png",
    description:
      "Second fully equipped surgical suite for complex and simultaneous procedures, reducing patient waiting times. Equipped with C-Arm fluoroscopy for precision intra-operative guidance.",
    badge: "C-Arm Equipped",
  },
  {
    title: "Digital X-Ray & Radiology",
    image: "/images/gallery/digital-xray.png",
    description:
      "Our digital radiology suite provides clear, high-resolution images for fracture diagnosis, joint assessment, spine evaluation, and pre-surgical planning with minimal radiation exposure.",
    badge: "Digital Imaging",
  },
  {
    title: "Physiotherapy Centre",
    image: "/images/gallery/physiotherapy.png",
    description:
      "A comprehensive rehabilitation centre with modern physiotherapy equipment — ultrasound therapy, TENS, IFT, traction units, exercise bikes, and a dedicated gym for post-op recovery.",
    badge: "Full Rehab",
  },
  {
    title: "Physiotherapy — Equipment",
    image: "/images/gallery/physiotherapy1.png",
    description:
      "Specialised machines for targeted therapy including laser therapy, short-wave diathermy, and wax bath treatment for hand injuries and arthritis. Personalised sessions for every patient.",
    badge: "Personalised Care",
  },
  {
    title: "In-house Pharmacy",
    image: "/images/gallery/medical-store.png",
    description:
      "Our 24/7 in-house pharmacy stocks all essential medicines, surgical consumables, and orthopaedic implants — ensuring zero delays between prescription and dispensing for admitted patients.",
    badge: "24/7 Available",
  },
  {
    title: "General Ward",
    image: "/images/gallery/general-ward.png",
    description:
      "Clean, well-ventilated general wards with dedicated nursing stations for close patient monitoring. TV, call bell, and 24-hour attendant facility available for patient comfort.",
    badge: "100+ Beds",
  },
  {
    title: "Dressing & Minor OT",
    image: "/images/gallery/dressing-room.png",
    description:
      "Dedicated dressing room and minor procedure room for wound care, sutures, plaster application, and minor daycare procedures — reducing wait times and hospital admissions.",
    badge: "Daycare Procedures",
  },
];

const features = [
  { title: "24/7 Emergency Care", icon: <Ambulance className="w-6 h-6" /> },
  { title: "100+ In-Patient Beds", icon: <Cpu className="w-6 h-6" /> },
  { title: "Senior Certified Specialists", icon: <ShieldCheck className="w-6 h-6" /> },
  { title: "Digital Diagnostic Imaging", icon: <Microscope className="w-6 h-6" /> },
  { title: "Full Physiotherapy & Rehab", icon: <Zap className="w-6 h-6" /> },
  { title: "Established Since 1996", icon: <Clock className="w-6 h-6" /> },
];

const FacilitiesPage = () => {
  return (
    <main className="pt-24 pb-16">
      {/* Hero */}
      <section className="bg-medical-50 py-16 mb-16">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-poppins">
              World-Class Facilities
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Balaji Hospital is equipped with state-of-the-art technology and modern infrastructure
              to deliver the highest standard of orthopaedic, ENT, and speciality care — all under
              one roof since 1996.
            </p>
          </div>
        </Container>
      </section>

      <Container>
        {/* Facility Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {facilities.map((facility, index) => (
            <div
              key={index}
              className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:border-medical-200 transition-all"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={facility.image}
                  alt={facility.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-medical-700 rounded-full text-xs font-bold uppercase tracking-widest">
                    {facility.badge}
                  </span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-3 font-poppins">
                  {facility.title}
                </h3>
                <p className="text-slate-500 leading-relaxed mb-6 text-sm">
                  {facility.description}
                </p>
                <div className="flex items-center gap-2 text-medical-600 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Available at Balaji Hospital</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden mb-16">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-medical-400 font-bold text-xs uppercase tracking-widest mb-6">
                <span className="w-8 h-0.5 bg-medical-400" /> Why Balaji Hospital
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 font-poppins">
                Our Commitment to Excellence
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="text-medical-400">{feature.icon}</div>
                    <span className="font-semibold text-slate-200 text-sm">
                      {feature.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-48 rounded-2xl overflow-hidden">
                  <Image
                    src="/images/gallery/img3.jpg"
                    alt="Orthopaedic Ward"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="h-32 relative rounded-2xl overflow-hidden bg-medical-600 flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-3xl font-black text-white">100+</span>
                  <span className="text-medical-200 text-xs font-bold uppercase tracking-widest mt-1">
                    In-patient Beds
                  </span>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="h-32 relative rounded-2xl overflow-hidden bg-accent-600 flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-3xl font-black text-white">24/7</span>
                  <span className="text-accent-200 text-xs font-bold uppercase tracking-widest mt-1">
                    Trauma Care
                  </span>
                </div>
                <div className="relative h-48 rounded-2xl overflow-hidden">
                  <Image
                    src="/images/gallery/img4.jpg"
                    alt="Private Patient Room"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-medical-500/10 rounded-full blur-3xl -mr-32 -mb-32" />
        </div>

        {/* CTA */}
        <section className="bg-medical-600 rounded-[3rem] p-12 md:p-16 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4 font-poppins">
              Plan Your Visit
            </h2>
            <p className="text-medical-100 max-w-lg mx-auto mb-8">
              Our team is available Monday to Saturday, 9AM – 5PM. Emergency services 24/7.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="px-8 py-4 bg-white text-medical-700 rounded-2xl font-bold hover:bg-medical-50 transition-all inline-flex items-center gap-2"
              >
                Book Appointment <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="tel:+917276229049"
                className="px-8 py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-bold hover:bg-white/20 transition-all"
              >
                +91 7276229049
              </a>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl" />
        </section>
      </Container>
    </main>
  );
};

export default FacilitiesPage;
