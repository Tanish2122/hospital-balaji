"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Container from "../ui/Container";
import Link from "next/link";

const treatments = [
  {
    title: "Spine Treatment",
    category: "Orthopedic",
    description:
      "Advanced spinal care for herniated discs, stenosis, and deformity correction using both surgical and non-surgical approaches.",
    image:
      "https://balajihospitaljaipur.com/uploads/gallery/5965221775reception1-small.png",
    color: "bg-amber-50 text-amber-600",
    href: "/departments/orthopedic/spine-treatment",
  },
  {
    title: "Knee Replacement",
    category: "Orthopedic",
    description:
      "Total and partial knee replacement using minimally invasive techniques for faster recovery and lasting pain relief.",
    image:
      "https://balajihospitaljaipur.com/uploads/gallery/9751225657generalWard-small.png",
    color: "bg-medical-50 text-medical-600",
    href: "/departments/orthopedic/knee-replacement",
  },
  {
    title: "Hip Replacement",
    category: "Orthopedic",
    description:
      "Cemented and cementless hip arthroplasty for arthritis and avascular necrosis, restoring mobility and quality of life.",
    image:
      "https://balajihospitaljaipur.com/uploads/gallery/6729552157ot2-small.png",
    color: "bg-amber-50 text-amber-600",
    href: "/departments/orthopedic/hip-replacement",
  },
  {
    title: "Ear Surgery",
    category: "ENT",
    description:
      "Microscopic tympanoplasty, mastoidectomy, and stapedectomy for hearing restoration and chronic ear infection management.",
    image:
      "https://balajihospitaljaipur.com/uploads/gallery/5729652157ot-small.png",
    color: "bg-blue-50 text-blue-600",
    href: "/departments/ent/ear-surgery",
  },
  {
    title: "Physiotherapy & Rehab",
    category: "Rehabilitation",
    description:
      "Comprehensive post-operative rehabilitation programs using modern physiotherapy equipment for full functional recovery.",
    image:
      "https://balajihospitaljaipur.com/uploads/gallery/6229751557physiotherapy-small.png",
    color: "bg-emerald-50 text-emerald-600",
    href: "/departments/orthopedic/physiotherapy",
  },
  {
    title: "Kidney Stones Treatment",
    category: "Speciality",
    description:
      "Modern laser lithotripsy and ESWL for effective, non-invasive removal of urinary and kidney stones.",
    image:
      "https://balajihospitaljaipur.com/uploads/gallery/2956725571digitalXray-small.png",
    color: "bg-purple-50 text-purple-600",
    href: "/departments/speciality/kidney-stones",
  },
];

export default function Treatments() {
  return (
    <section id="treatments" className="py-24 bg-slate-50 relative overflow-hidden">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-medical-600 font-bold text-xs uppercase tracking-widest mb-4">
            <span className="w-8 h-0.5 bg-medical-600" />
            Our Treatments
            <span className="w-8 h-0.5 bg-medical-600" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-6 underline decoration-medical-100 decoration-8 underline-offset-4">
            Specialized <span className="text-gradient">Procedures</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Expert surgical and non-surgical care across orthopaedic, ENT, and speciality disciplines
            using the latest minimally invasive technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {treatments.map((treatment, index) => (
            <motion.div
              key={treatment.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:border-medical-500 transition-all duration-300 group hover:shadow-2xl hover:shadow-medical-500/10"
            >
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={treatment.image}
                  alt={treatment.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                <div className="absolute bottom-5 left-6 text-white">
                  <h3 className="text-xl font-bold mb-1">{treatment.title}</h3>
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${treatment.color} border border-white/20`}
                  >
                    {treatment.category}
                  </div>
                </div>
              </div>
              <div className="p-7">
                <p className="text-slate-600 text-sm mb-5 leading-relaxed">
                  {treatment.description}
                </p>
                <Link
                  href={treatment.href}
                  className="text-sm font-bold text-slate-900 hover:text-medical-600 transition-colors flex items-center gap-2 group/btn"
                >
                  Learn More{" "}
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/departments"
            className="inline-flex items-center gap-2 px-8 py-4 bg-medical-600 text-white rounded-2xl font-bold hover:bg-medical-700 transition-all shadow-xl shadow-medical-500/20"
          >
            View All Departments <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
