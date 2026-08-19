"use client";

import React, { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { 
  CheckCircle2, 
  Ambulance, 
  Cpu, 
  ShieldCheck, 
  Microscope, 
  ArrowRight, 
  Clock, 
  Zap, 
  Maximize2, 
  X, 
  Image as ImageIcon,
  Sparkles,
  Layers,
  Search
} from "lucide-react";
import FacilitiesCTA from "@/components/facilities/FacilitiesCTA";
import { cn } from "@/lib/utils";

interface FacilityItem {
  id: string;
  title: string;
  image: string;
  description: string;
  badge: string;
  category?: string;
  type?: string;
}

const features = [
  { title: "24/7 Emergency Care", icon: <Ambulance className="w-6 h-6" /> },
  { title: "100+ In-Patient Beds", icon: <Cpu className="w-6 h-6" /> },
  { title: "Senior Certified Specialists", icon: <ShieldCheck className="w-6 h-6" /> },
  { title: "Digital Diagnostic Imaging", icon: <Microscope className="w-6 h-6" /> },
  { title: "Full Physiotherapy & Rehab", icon: <Zap className="w-6 h-6" /> },
  { title: "Established Since 1996", icon: <Clock className="w-6 h-6" /> },
];

export default function FacilitiesContent() {
  const [facilitiesList, setFacilitiesList] = useState<FacilityItem[]>([]);
  const [isDynamic, setIsDynamic] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ title: string; image: string; description?: string; category?: string } | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacilityGallery();
  }, []);

  const fetchFacilityGallery = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        // Filter items that are facility type or facility category
        const facilityTypeItems = data.filter(
          (item) => 
            item.type === "facility" || 
            item.category?.toLowerCase().includes("facility") ||
            item.category?.toLowerCase().includes("theatre") ||
            item.category?.toLowerCase().includes("room") ||
            item.category?.toLowerCase().includes("equipment") ||
            item.category?.toLowerCase().includes("view") ||
            (!item.type && !item.category?.toLowerCase().includes("xray") && !item.category?.toLowerCase().includes("news"))
        );

        if (facilityTypeItems.length > 0) {
          setIsDynamic(true);

          // Convert CMS items to FacilityItem format
          const dynamicFacilities: FacilityItem[] = facilityTypeItems.map((item) => ({
            id: item.id,
            title: item.title || "Hospital Facility",
            image: item.url,
            description:
              item.description?.replace(/<[^>]*>/g, "") ||
              "State-of-the-art facility equipped with modern infrastructure at Balaji Hospital.",
            badge: item.category || "Facility",
            category: item.category || "Facilities",
            type: item.type,
          }));

          setFacilitiesList(dynamicFacilities);
        } else {
          setFacilitiesList([]);
        }
      } else {
        setFacilitiesList([]);
      }
    } catch (err) {
      console.warn("Could not fetch facility gallery from Supabase.", err);
      setFacilitiesList([]);
    } finally {
      setLoading(false);
    }
  };

  // Categories for interactive filtering
  const categories = ["All", ...Array.from(new Set(facilitiesList.map((f) => f.category || "General")))];

  const filteredFacilities =
    activeCategory === "All"
      ? facilitiesList
      : facilitiesList.filter((f) => f.category === activeCategory);

  return (
    <main className="pt-24 pb-16 bg-slate-50/40">
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 bg-white border-b border-slate-100 overflow-hidden mb-12">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-medical-50/60 skew-x-12 -mr-20 pointer-events-none" />
        <Container className="relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-medical-50 text-medical-700 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-medical-100">
              <Sparkles className="w-3.5 h-3.5" /> Visual Infrastructure & Care
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 font-poppins tracking-tight">
              World-Class <span className="text-medical-600">Facilities</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
              Balaji Hospital is equipped with state-of-the-art technology, modern surgical OTs, digital radiology,
              and comfortable patient wards to deliver the highest standard of orthopaedic, ENT, and speciality care — all under one roof since 1996.
            </p>
          </div>
        </Container>
      </section>

      <Container>
        {/* Category Filters & Live Sync Badge */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap uppercase tracking-wider border",
                  activeCategory === cat
                    ? "bg-medical-600 text-white border-medical-600 shadow-md shadow-medical-600/20"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {isDynamic && (
              <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-2xl border border-emerald-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Live CMS Synced</span>
              </div>
            )}
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-medical-600" />
              <span>{filteredFacilities.length} Facilities</span>
            </div>
          </div>
        </div>

        {/* Dynamic Facility Grid / Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="bg-white rounded-[2.5rem] p-4 border border-slate-100 animate-pulse space-y-4">
                <div className="h-48 bg-slate-100 rounded-2xl" />
                <div className="h-6 bg-slate-100 rounded-full w-2/3" />
                <div className="h-12 bg-slate-100 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : filteredFacilities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {filteredFacilities.map((facility, index) => (
              <div
                key={facility.id || index}
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:border-medical-200 transition-all duration-300 flex flex-col"
              >
                <div
                  className="relative aspect-[16/10] overflow-hidden cursor-pointer bg-slate-100"
                  onClick={() =>
                    setSelectedImage({
                      title: facility.title,
                      image: facility.image,
                      description: facility.description,
                      category: facility.badge,
                    })
                  }
                >
                  <img
                    src={facility.image}
                    alt={facility.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3.5 py-1.5 bg-white/95 backdrop-blur-md text-medical-700 rounded-full text-[11px] font-black uppercase tracking-widest shadow-sm">
                      {facility.badge}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="px-4 py-2 bg-white/90 rounded-full text-xs font-bold text-slate-900 flex items-center gap-2 shadow-lg">
                      <Maximize2 className="w-4 h-4 text-medical-600" /> Expand View
                    </span>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 font-poppins group-hover:text-medical-600 transition-colors">
                      {facility.title}
                    </h3>
                    <p className="text-slate-500 leading-relaxed mb-6 text-sm">
                      {facility.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-medical-600 font-bold text-sm pt-4 border-t border-slate-100">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>Available at Balaji Hospital</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="col-span-full py-20 mb-24 bg-white rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
            <Search className="w-12 h-12 mb-4 text-slate-300" />
            <p className="font-bold text-slate-600">No facilities found.</p>
            <p className="text-sm text-slate-400 mt-1">Upload facility assets in CMS under Gallery to publish them here.</p>
          </div>
        )}

        {/* Why Choose Us / Infrastructure Features */}
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden mb-16 shadow-2xl">
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
                <div 
                  className="relative h-48 rounded-2xl overflow-hidden cursor-pointer group/img border border-white/10" 
                  onClick={() => {
                    const item = facilitiesList[0];
                    setSelectedImage({ 
                      title: item?.title || "Operation Theatre Suite", 
                      image: item?.image || "/images/facilities/WhatsApp Image 2026-07-28 at 11.54.33 AM.jpeg", 
                      description: item?.description || "State-of-the-art operation theatre suite at Balaji Hospital.",
                      category: item?.badge || "Facility" 
                    });
                  }}
                >
                  <img
                    src={facilitiesList[0]?.image || "/images/facilities/WhatsApp Image 2026-07-28 at 11.54.33 AM.jpeg"}
                    alt={facilitiesList[0]?.title || "Hospital Facility"}
                    className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-90 group-hover/img:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                    <span className="text-[9px] font-black text-medical-400 uppercase tracking-widest">
                      {facilitiesList[0]?.badge || "Facility"}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate">
                      {facilitiesList[0]?.title || "Operation Theatre Suite"}
                    </h4>
                  </div>
                </div>
                <div className="h-32 relative rounded-2xl overflow-hidden bg-medical-600 flex flex-col items-center justify-center p-6 text-center shadow-lg">
                  <span className="text-3xl font-black text-white">100+</span>
                  <span className="text-medical-200 text-xs font-bold uppercase tracking-widest mt-1">
                    In-patient Beds
                  </span>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="h-32 relative rounded-2xl overflow-hidden bg-amber-500 flex flex-col items-center justify-center p-6 text-center shadow-lg">
                  <span className="text-3xl font-black text-slate-900">24/7</span>
                  <span className="text-slate-900/80 text-xs font-bold uppercase tracking-widest mt-1">
                    Trauma Care
                  </span>
                </div>
                <div 
                  className="relative h-48 rounded-2xl overflow-hidden cursor-pointer group/img border border-white/10" 
                  onClick={() => {
                    const item = facilitiesList[1] || facilitiesList[0];
                    setSelectedImage({ 
                      title: item?.title || "Patient Care Unit", 
                      image: item?.image || "/images/facilities/WhatsApp Image 2026-07-28 at 11.54.36 AM.jpeg", 
                      description: item?.description || "Patient care unit and diagnostic facilities at Balaji Hospital.",
                      category: item?.badge || "Facility" 
                    });
                  }}
                >
                  <img
                    src={facilitiesList[1]?.image || facilitiesList[0]?.image || "/images/facilities/WhatsApp Image 2026-07-28 at 11.54.36 AM.jpeg"}
                    alt={facilitiesList[1]?.title || facilitiesList[0]?.title || "Hospital Facility"}
                    className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-90 group-hover/img:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                    <span className="text-[9px] font-black text-medical-400 uppercase tracking-widest">
                      {facilitiesList[1]?.badge || facilitiesList[0]?.badge || "Facility"}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate">
                      {facilitiesList[1]?.title || facilitiesList[0]?.title || "Patient Care Unit"}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-medical-500/10 rounded-full blur-3xl -mr-32 -mb-32 pointer-events-none" />
        </div>

        <FacilitiesCTA />
      </Container>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 bg-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="flex-1 min-h-[40vh] md:min-h-[60vh] flex items-center justify-center bg-black/40 relative">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="max-w-full max-h-[75vh] object-contain shadow-2xl"
              />
            </div>
            <div className="w-full md:w-80 p-8 flex flex-col justify-center space-y-6">
              <div className="space-y-2">
                <span className="text-medical-400 font-bold text-xs uppercase tracking-widest">
                  {selectedImage.category || "Hospital Facility"}
                </span>
                <h3 className="text-2xl font-black text-white leading-tight font-poppins">
                  {selectedImage.title}
                </h3>
              </div>
              <hr className="border-white/10" />
              <p className="text-slate-300 text-sm leading-relaxed">
                {selectedImage.description ||
                  "State-of-the-art medical infrastructure and facility at Balaji Hospital, Jaipur."}
              </p>
              <div className="pt-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-medical-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Verified Balaji Hospital Facility
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
