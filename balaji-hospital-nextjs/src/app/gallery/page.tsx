'use client'

import React, { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { 
  Plus, 
  Search, 
  Grid, 
  FileText, 
  Loader2, 
  X, 
  ChevronRight, 
  ChevronLeft,
  Calendar,
  Zap,
  CheckCircle2,
  Maximize2
} from 'lucide-react'
import { cn } from "@/lib/utils";

interface GalleryItem {
  id: string
  url: string
  title: string
  description: string
  category: string
  type: 'facility' | 'xray' | 'news'
  created_at: string
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)
  const [activeXrayCategory, setActiveXrayCategory] = useState<string>('All')

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    const { data } = await supabase
      .from('gallery')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    if (data) setItems(data)
    setLoading(false)
  }

  const facilities = items.filter(i => i.type === 'facility')
  const xrays = items.filter(i => i.type === 'xray')
  const news = items.filter(i => i.type === 'news')

  const xrayCategories = ['All', ...new Set(xrays.map(x => x.category || 'Other'))]
  const filteredXrays = activeXrayCategory === 'All' 
    ? xrays 
    : xrays.filter(x => (x.category || 'Other') === activeXrayCategory)

  if (loading) {
    return (
      <div className="min-h-screen py-32 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-500 font-medium tracking-tight">Designing your visual experience...</p>
      </div>
    )
  }

  return (
    <main className="pt-24 pb-20 bg-slate-50/30">
      {/* Header Section */}
      <section className="relative py-20 overflow-hidden bg-white border-b border-slate-100">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 skew-x-12 -mr-20" />
        <Container className="relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
              <Plus className="w-3 h-3" /> Visual Tour
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-slate-800 tracking-tight leading-none mb-6">
              Hospital <span className="text-blue-600">Gallery</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed font-medium">
              A comprehensive glimpse into our state-of-the-art facilities, specialized diagnostics, and clinical excellence.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-16 space-y-32">
        {/* SECTION 1: OUR FACILITIES */}
        <section id="facilities">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg" />
                Our Facilities
              </h2>
              <p className="text-slate-500 mt-2 font-medium">World-class infrastructure designed for compassionate care.</p>
            </div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                {facilities.length} Images Found
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((item) => (
              <GalleryCard key={item.id} item={item} onClick={() => setSelectedImage(item)} />
            ))}
            {facilities.length === 0 && <EmptyState label="Infrastructure images will appear here." />}
          </div>
        </section>

        {/* SECTION 2: PATIENT X-RAYS */}
        <section id="xrays" className="bg-slate-900 rounded-[3rem] p-8 md:p-16 text-white shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <div>
              <h2 className="text-3xl font-black tracking-tight uppercase flex items-center gap-3">
                <div className="w-8 h-8 bg-accent-400 rounded-lg" />
                Patient X-Rays
              </h2>
              <p className="text-slate-400 mt-2 font-medium">Categorized medical diagnostics for specialist review.</p>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {xrayCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveXrayCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-bold transition-all border border-white/10",
                    activeXrayCategory === cat 
                      ? "bg-accent-400 text-slate-900 border-accent-400" 
                      : "bg-white/5 text-white/60 hover:bg-white/10"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredXrays.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedImage(item)}
                className="aspect-square relative group rounded-2xl overflow-hidden cursor-zoom-in border border-white/10 hover:border-accent-400/50 transition-all shadow-lg"
              >
                <img 
                   src={item.url} 
                   alt={item.title} 
                   className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 opacity-80 group-hover:opacity-100" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                    <p className="font-bold text-accent-400 text-[10px] uppercase tracking-widest">{item.category}</p>
                    <h4 className="font-bold text-xs truncate">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
          {filteredXrays.length === 0 && <p className="text-center py-20 text-slate-500 italic">No X-rays found for this category.</p>}
        </section>

        {/* SECTION 3: NEWS & UPDATES */}
        <section id="news">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500 rounded-lg" />
                News & Updates
              </h2>
              <p className="text-slate-500 mt-2 font-medium">Stay updated with our latest events and hospital news.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <div key={item.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:border-blue-200 transition-all shadow-sm hover:shadow-xl flex flex-col">
                 <div className="aspect-[16/10] overflow-hidden relative">
                    <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-widest">
                        NEW UPDATE
                    </div>
                 </div>
                 <div className="p-8 space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.created_at).toLocaleDateString()}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 uppercase tracking-tight leading-tight group-hover:text-blue-600 transition-colors">{item.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                        {item.description || 'Stay informed about the latest developments and specialized medical updates at Balaji Hospital.'}
                    </p>
                 </div>
              </div>
            ))}
            {news.length === 0 && <EmptyState label="News updates are coming soon." />}
          </div>
        </section>
      </Container>

      {/* LIGHTBOX MODAL */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
           <button 
             onClick={() => setSelectedImage(null)}
             className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
           >
             <X className="w-6 h-6" />
           </button>
           
           <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 bg-slate-900 rounded-3xl overflow-hidden border border-white/10">
              <div className="flex-1 min-h-[50vh] flex items-center justify-center bg-black/40 relative group">
                <img src={selectedImage.url} alt={selectedImage.title} className="max-w-full max-h-[80vh] object-contain shadow-2xl" />
              </div>
              <div className="w-full md:w-80 p-8 flex flex-col justify-center space-y-6">
                <div className="space-y-2">
                    <span className="text-blue-400 font-bold text-xs uppercase tracking-widest">{selectedImage.type}</span>
                    <h3 className="text-2xl font-black text-white leading-tight uppercase tracking-tight">{selectedImage.title || 'Gallery View'}</h3>
                </div>
                <hr className="border-white/10" />
                <p className="text-slate-400 text-sm leading-relaxed italic">
                    {selectedImage.description || 'No additional description provided for this item.'}
                </p>
                <div className="pt-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-blue-400">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Verified Hospital Content</p>
                </div>
              </div>
           </div>
        </div>
      )}
    </main>
  );
}

function GalleryCard({ item, onClick }: { item: GalleryItem, onClick: () => void }) {
    return (
        <div 
            onClick={onClick}
            className="group relative h-80 rounded-[2.5rem] overflow-hidden cursor-zoom-in border border-white shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
        >
            <img src={item.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-blue-400 font-bold text-[10px] uppercase tracking-widest mb-2 block">{item.category || 'General'}</span>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">{item.title || 'Building View'}</h3>
                    <div className="mt-4 flex items-center gap-2 text-white/60 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity delay-150">
                        <Maximize2 className="w-3 h-3 text-blue-400" /> View Large
                    </div>
                </div>
            </div>
        </div>
    )
}

function EmptyState({ label }: { label: string }) {
    return (
        <div className="col-span-full py-20 bg-white/50 rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 italic">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p className="tracking-tight">{label}</p>
        </div>
    )
}
