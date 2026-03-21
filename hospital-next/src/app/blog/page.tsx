import React from "react";
import Container from "@/components/ui/Container";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/blog";

export const metadata = {
  title: "Health Articles & Blog | Balaji Hospital Jaipur",
  description:
    "Stay updated with the latest health tips, medical breakthroughs, and wellness articles from specialists at Balaji Hospital & Orthopaedic Centre, Jaipur.",
};

const BlogPage = () => {
  return (
    <main className="pt-24 pb-16">
      <section className="bg-medical-50 py-16 mb-16">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-poppins">
              Health Articles
            </h1>
            <p className="text-lg text-slate-600">
              Expert advice, medical breakthroughs, and health tips from our specialised doctors — helping you make informed decisions about your health.
            </p>
          </div>
        </Container>
      </section>

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-24">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:border-medical-200 transition-all hover:shadow-2xl hover:shadow-medical-100 flex flex-col"
            >
              <div className="relative aspect-[16/11] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-medical-700 rounded-full text-xs font-bold tracking-widest uppercase">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-4 tracking-widest uppercase">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" /> {post.author}
                  </div>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-4 font-poppins group-hover:text-medical-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-slate-500 leading-relaxed mb-8 line-clamp-3 flex-grow">
                  {post.excerpt}
                </p>
                <div className="mt-auto">
                  <Link
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center gap-2 font-bold text-medical-600 group-hover:gap-4 transition-all"
                  >
                    Read Full Article
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="bg-slate-900 rounded-[3rem] p-8 md:p-16 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-poppins">
              Subscribe to Health Updates
            </h2>
            <p className="text-slate-300 max-w-xl mx-auto mb-10 text-lg">
              Get the latest health tips and hospital news delivered directly to
              your inbox.
            </p>
            <form className="max-w-md mx-auto flex gap-4 flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-6 py-4 bg-white/10 border border-white/20 rounded-2xl outline-none focus:bg-white/20 transition-all placeholder:text-white/50 text-white"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-medical-600 text-white rounded-2xl font-bold hover:bg-medical-700 transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-medical-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        </section>
      </Container>
    </main>
  );
};

export default BlogPage;
