import React from "react";
import Container from "@/components/ui/Container";
import Image from "next/image";
import { Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { doctors as localDoctors } from "@/data/doctors";
import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "Our Doctors | Balaji Cure & Care Hospital",
  description: "Meet our highly qualified team of specialists at Balaji Hospital Jaipur, including senior orthopedic and ENT surgeons.",
};

export const revalidate = 60; // Revalidate every 60 seconds

async function getDoctors() {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select(`
        id,
        name,
        slug,
        experience_years,
        image_url,
        designation,
        departments(name)
      `)
      .eq('is_active', true);

    if (error || !data || data.length === 0) {
      // Fallback to local static data
      return localDoctors.map((d) => ({
        id: d.id,
        name: d.name,
        specialty: d.specialty,
        image: d.image,
        experience: d.experience,
        department: d.department,
      }));
    }

    return data.map((doc: any) => ({
      id: doc.slug || doc.id,
      name: doc.name || 'Unknown Doctor',
      specialty: doc.designation || 'Specialist',
      image: doc.image_url || '/images/gallery/physiotherapy.png',
      experience: doc.experience_years ? `${doc.experience_years}+ Years` : 'Experienced',
      department: doc.departments?.name || 'General',
    }));
  } catch {
    // Network / fetch error — fall back to local data silently
    return localDoctors.map((d) => ({
      id: d.id,
      name: d.name,
      specialty: d.specialty,
      image: d.image,
      experience: d.experience,
      department: d.department,
    }));
  }
}

export default async function DoctorsPage() {
  const mappedDoctors = await getDoctors();

  return (
    <main className="pt-24 pb-16">
      <section className="bg-medical-50 py-16 mb-16">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-poppins">
              Our Specialists
            </h1>
            <p className="text-lg text-slate-600">
              A team of experienced healthcare professionals dedicated to your well-being.
            </p>
          </div>
        </Container>
      </section>

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {mappedDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:border-medical-200 transition-all hover:shadow-2xl hover:shadow-medical-100"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-6 left-6 right-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <Link 
                    href={`/doctors/${doctor.id}`}
                    className="w-full py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-white hover:text-medical-600 transition-colors"
                  >
                    View Profile
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent-400 text-accent-400" />
                  ))}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 font-poppins group-hover:text-medical-600 transition-colors">
                  {doctor.name}
                </h3>
                <p className="text-medical-600 font-semibold mb-3 text-sm tracking-wide uppercase">
                  {doctor.specialty}
                </p>
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-slate-400 text-sm">
                  <span>{doctor.experience}</span>
                  <span className="bg-slate-50 px-3 py-1 rounded-full text-xs text-center">{doctor.department}</span>
                </div>
              </div>
            </div>
          ))}
          
          {mappedDoctors.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
              <p>No doctors found. Please ensure they are added in the Supabase database.</p>
            </div>
          )}
        </div>

        <section className="bg-medical-600 rounded-[3rem] p-8 md:p-16 text-white overflow-hidden relative">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 font-poppins leading-tight">
                Want to join our <br /> medical team?
              </h2>
              <p className="text-medical-100 text-lg mb-8 max-w-lg">
                We are always looking for passionate healthcare professionals to join our family at Balaji Hospital & Orthopaedic Centre.
              </p>
              <Link
                href="/careers"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-medical-600 rounded-2xl font-bold hover:bg-medical-50 transition-all shadow-xl shadow-medical-900/20"
              >
                Join Our Team
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="hidden lg:block relative aspect-square max-w-sm mx-auto">
              {/* Optional: Add a team image here */}
            </div>
          </div>
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-400/10 rounded-full -ml-32 -mb-32 blur-3xl" />
        </section>
      </Container>
    </main>
  );
}
