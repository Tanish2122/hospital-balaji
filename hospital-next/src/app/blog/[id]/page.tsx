import React from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft, Share2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { blogPosts } from "@/data/blog";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    id: post.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = blogPosts.find((p) => p.id === id);
  if (!post) return {};
  return {
    title: `${post.title} | Balaji Hospital Blog`,
    description: post.excerpt,
  };
}

const BlogDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    notFound();
  }

  const related = blogPosts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <main className="pt-24 pb-16">
      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-medical-600 font-bold mb-8 hover:gap-3 transition-all"
            >
              <ArrowLeft className="w-5 h-5" /> Back to Blog
            </Link>

            <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-medical-500" /> {post.date}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-medical-500" /> {post.author}
              </div>
              <span className="px-3 py-1 bg-medical-100 text-medical-700 rounded-full text-xs font-bold tracking-widest">
                {post.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-12 font-poppins leading-tight">
              {post.title}
            </h1>

            <div className="relative aspect-[21/9] rounded-[3rem] overflow-hidden mb-16 shadow-2xl">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
              <div className="lg:col-span-3">
                <div
                  className="prose prose-lg prose-slate max-w-none text-slate-600 prose-headings:font-poppins prose-headings:text-slate-900 prose-strong:text-slate-900 prose-a:text-medical-600 prose-li:marker:text-medical-500"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-slate-400 uppercase tracking-widest text-xs">
                      Share:
                    </span>
                    <button
                      className="p-3 bg-slate-50 rounded-2xl text-slate-600 hover:bg-medical-50 hover:text-medical-600 transition-all"
                      title="Share article"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <aside className="space-y-10">
                <div className="p-8 bg-medical-50 rounded-[2.5rem] border border-medical-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 font-poppins">
                    Ready for Care?
                  </h3>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    Consult our specialists regarding any concerns mentioned in
                    this article.
                  </p>
                  <Link
                    href="/contact"
                    className="w-full py-4 bg-medical-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-medical-700 transition-all shadow-lg shadow-medical-200"
                  >
                    Contact Hospital
                  </Link>
                  <a
                    href="tel:+917276229049"
                    className="mt-3 w-full py-3 bg-white border border-medical-200 text-medical-700 rounded-2xl font-bold flex items-center justify-center gap-2 hover:border-medical-500 transition-all text-sm"
                  >
                    +91 7276229049
                  </a>
                </div>

                {related.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-6 font-poppins">
                      Recent Articles
                    </h3>
                    <div className="space-y-6">
                      {related.map((p) => (
                        <Link key={p.id} href={`/blog/${p.id}`} className="group block">
                          <div className="text-xs font-bold text-medical-600 uppercase mb-1">
                            {p.date}
                          </div>
                          <h4 className="font-bold text-slate-900 group-hover:text-medical-600 transition-colors leading-snug">
                            {p.title}
                          </h4>
                        </Link>
                      ))}
                    </div>
                    <Link
                      href="/blog"
                      className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-medical-600 hover:gap-3 transition-all"
                    >
                      All Articles <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
};

export default BlogDetailPage;
