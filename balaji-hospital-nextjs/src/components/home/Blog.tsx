"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Calendar, User } from "lucide-react";
import Container from "../ui/Container";

const blogs = [
  {
    title: "Hip Replacement Surgery: Benefits, Recovery Time & Success Rate",
    category: "Orthopedics",
    author: "Dr. Ramesh Agarwal",
    date: "Mar 15, 2026",
    content: "Hip replacement surgery can significantly improve the quality of life for patients with chronic hip pain and stiffness.",
    image: "/images/gallery/img1.jpg",
  },
  {
    title: "Why Regular Gynecological Check-ups Are Essential for Women's Health",
    category: "Speciality",
    author: "Dr. Saloni Agarwal",
    date: "Mar 12, 2026",
    content: "Routine examinations are crucial for early detection and prevention of various health conditions affecting women.",
    image: "/images/gallery/reception.png",
  },
  {
    title: "Shoulder Pain: Symptoms, Treatment and Prevention Tips",
    category: "Orthopedics",
    author: "Dr. Utkarsh Agarwal",
    date: "Mar 10, 2026",
    content: "Identifying the cause of shoulder pain is the first step toward effective treatment and regaining mobility.",
    image: "/images/gallery/ot.png",
  },
];

export default function Blog() {
  return (
    <section id="blog" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-full h-1/2 bg-white skew-y-3 -translate-y-1/2 opacity-50" />
      
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
          <div className="inline-flex items-center gap-2 text-medical-600 font-bold text-xs uppercase tracking-widest mb-4">
            <span className="w-8 h-0.5 bg-medical-600" />
            Our Blog
            <span className="w-8 h-0.5 bg-medical-600" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-6 underline decoration-medical-100 decoration-8 underline-offset-4">
            Read Our <span className="text-gradient">Latest Articles</span>
          </h2>
          <p className="text-slate-600 text-lg">
            Stay informed with health tips, treatment insights, and hospital updates from our medical experts.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-6 left-6 bg-medical-600 text-white text-[10px] font-black tracking-widest uppercase px-4 py-2 rounded-xl shadow-lg ring-4 ring-white/10 backdrop-blur-sm">
                  {blog.category}
                </div>
              </div>

              <div className="p-10">
                <div className="flex items-center gap-6 text-slate-500 text-xs font-bold uppercase tracking-wider mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-medical-600" />
                    {blog.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-medical-600" />
                    {blog.author}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-6 line-clamp-2 min-h-[3.5rem] group-hover:text-medical-600 transition-colors">
                  {blog.title}
                </h3>
                
                <p className="text-slate-600 text-sm mb-8 line-clamp-2 leading-relaxed">
                  {blog.content}
                </p>

                <div className="pt-8 border-t border-slate-100">
                  <span className="inline-flex items-center gap-2 text-medical-600 font-black text-xs uppercase tracking-widest group/btn hover:gap-4 transition-all">
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
