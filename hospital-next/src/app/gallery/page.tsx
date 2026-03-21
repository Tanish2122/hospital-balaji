import React from "react";
import Container from "@/components/ui/Container";
import Image from "next/image";
import { galleryItems } from "@/data/gallery";

export const metadata = {
  title: "Gallery | Balaji Cure & Care Hospital",
  description: "A visual tour of Balaji Hospital's state-of-the-art facilities, operation theaters, wards, and diagnostic centers.",
};

const GalleryPage = () => {
  return (
    <main className="pt-24 pb-16">
      <section className="bg-medical-50 py-16 mb-16">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-poppins">
              Hospital Gallery
            </h1>
            <p className="text-lg text-slate-600">
              A glimpse into our world-class infrastructure and compassionate environment.
            </p>
          </div>
        </Container>
      </section>

      <Container>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 mb-24">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="break-inside-avoid group relative rounded-3xl overflow-hidden cursor-zoom-in border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={800}
                height={600}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <span className="text-accent-400 font-bold text-xs uppercase tracking-widest mb-2">
                  {item.category}
                </span>
                <h3 className="text-xl font-bold text-white font-poppins">
                  {item.alt}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <section className="bg-slate-50 rounded-[3rem] p-12 text-center border border-slate-100">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 font-poppins italic text-medical-600">
            "Compassionate Care, Advanced Technology"
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Our facilities are designed to provide the highest level of comfort and medical precision 
            to ensure every patient feels at home while receiving expert treatment.
          </p>
        </section>
      </Container>
    </main>
  );
};

export default GalleryPage;
