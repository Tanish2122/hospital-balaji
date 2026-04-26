"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, User, Loader2 } from "lucide-react";
import Container from "../ui/Container";
import { supabase } from "@/lib/supabase";

interface BlogData {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  content: string;
  image: string;
  slug: string;
}

export default function Blog() {
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(3);

      if (!error && data) {
        const formatted = data.map(post => {
          const dateObj = post.published_at ? new Date(post.published_at) : new Date(post.created_at);
          return {
            id: post.id,
            slug: post.slug || post.id,
            title: post.title,
            category: "Health & Wellness",
            author: "Balaji Desk",
            date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            // Strip HTML tags from TipTap-generated content for plain text preview
            content: post.excerpt || post.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 150) + "...",
            image: post.featured_image_url || "/images/gallery/img1.jpg",
          } as BlogData;
        });
        setBlogs(formatted);
      }
      setLoading(false);
    }
    fetchBlogs();
  }, []);

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
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-6 underline decoration-medical-100 decoration-8 underline-offset-4 font-poppins">
            Read Our <span className="text-medical-600">Latest Articles</span>
          </h2>
          <p className="text-slate-600 text-lg sm:px-4">
            Stay informed with health tips, treatment insights, and hospital updates from our medical experts.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-[3rem] border border-dashed border-slate-200">
             <Loader2 className="w-8 h-8 animate-spin text-medical-600 mb-4" />
             <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Fetching articles...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-[3rem] border border-dashed border-slate-200">
             <p className="text-slate-400 italic">No articles published yet. Stay tuned!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {blogs.map((blog, index) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500 flex flex-col"
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

                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-6 text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-medical-600" />
                      {blog.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3 text-medical-600" />
                      {blog.author}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-6 line-clamp-2 min-h-[3.5rem] group-hover:text-medical-600 transition-colors font-poppins">
                    {blog.title}
                  </h3>
                  
                  <p className="text-slate-600 text-sm mb-8 line-clamp-2 leading-relaxed flex-1">
                    {blog.content}
                  </p>

                  <div className="pt-8 border-t border-slate-100 mt-auto">
                    <Link href={`/blog/${blog.slug}`} className="inline-flex items-center gap-2 text-medical-600 font-black text-xs uppercase tracking-widest group/btn hover:gap-4 transition-all">
                      Read Full Article
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

