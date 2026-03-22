"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Instagram, Facebook, Youtube, Play, Heart, MessageCircle, Share2, ExternalLink, ThumbsUp, MessageSquare } from "lucide-react";
import Container from "../ui/Container";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const instagramPosts = [
  {
    id: 1,
    image: "/images/gallery/img1.jpg",
    likes: "1.2k",
    comments: "45",
    type: "image",
    caption: "Successful knee fracture recovery story of our happy patient.",
  },
  {
    id: 2,
    image: "/images/gallery/reception.png",
    likes: "850",
    comments: "32",
    type: "video",
    caption: "A walkthrough of our patient-friendly reception and waiting area.",
  },
  {
    id: 3,
    image: "/images/gallery/ot.png",
    likes: "2.1k",
    comments: "112",
    type: "image",
    caption: "Our highly advanced modular OT ready for a complex orthopedic surgery.",
  },
  {
    id: 4,
    image: "/images/gallery/img1.jpg",
    likes: "940",
    comments: "28",
    type: "image",
    caption: "Specialized physiotherapy sessions for post-surgery recovery.",
  },
];

const youtubeVideos = [
  {
    id: "w_nDMzNpT24",
    title: "Success Story: Complex Orthopedic Surgery",
    thumbnail: "https://img.youtube.com/vi/w_nDMzNpT24/maxresdefault.jpg",
    views: "5.4k",
    duration: "4:20",
  },
  {
    id: "yt_tour_123",
    title: "Hospital Infrastructure & Facilities Tour 2026",
    thumbnail: "https://img.youtube.com/vi/w_nDMzNpT24/hqdefault.jpg",
    views: "3.2k",
    duration: "3:15",
  },
];

const facebookPost = {
  author: "Balaji Hospital Jaipur",
  date: "2 hours ago",
  content: "अरे ये क्या? कहीं आपके जीवन की गाड़ी भी रुक तो नहीं चल रही? क्या 2 कदम भी चलना आपके लिए मुश्किल हो गया है? हमारे विशेषज्ञ डॉक्टरों से सलाह लें और दर्द मुक्त जीवन की शुरुआत करें। #JointPain #JaipurHospital #HealthAwareness",
  image: "/images/gallery/reception.png",
  likes: "245",
  comments: "18",
  shares: "12",
};

export default function SocialMedia() {
  const [posts, setPosts] = useState(instagramPosts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchLiveFeed() {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'social_feed')
        .single();

      const config = data?.value as any;
      console.log('SocialMedia Social Config:', config);
      
      if (config?.type === 'live' && config?.instagram_url) {
        setLoading(true);
        try {
          console.log('SocialMedia Fetching from:', config.instagram_url);
          const res = await fetch(config.instagram_url);
          const json = await res.json();
          console.log('SocialMedia Data Received:', json);
          
          // Map Behold.so or standard API format
          const rawPosts = json.posts || json.data || json;
          if (Array.isArray(rawPosts)) {
            const formatted = rawPosts.slice(0, 4).map((p: any) => ({
              id: p.id || Math.random().toString(),
              image: p.media_url || p.image || p.thumbnail_url || p.url,
              likes: p.like_count || p.likes || 'Live',
              comments: p.comments_count || p.comments || '...',
              type: (p.media_type || p.type || '').toLowerCase().includes('video') ? 'video' : 'image',
              caption: p.caption || p.text || 'Latest from Instagram',
              permalink: p.permalink || p.link
            }));
            console.log('SocialMedia Formatted Posts:', formatted);
            setPosts(formatted);
          }
        } catch (err) {
          console.error("Failed to fetch live social feed:", err);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('SocialMedia Live Sync is DISABLED or URL is missing.');
      }
    }
    fetchLiveFeed();
  }, []);

  return (
    <section id="social" className="py-24 bg-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-medical-50/50 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-50/50 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2" />

      <Container>
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left Side: Instagram & General Header */}
          <div className="flex-1">
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 text-medical-600 font-bold text-xs uppercase tracking-widest mb-4">
                <span className="w-8 h-0.5 bg-medical-600" />
                Social Feed
              </div>
              <h2 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-6 font-poppins">
                Real Stories, <br />
                <span className="text-gradient">Real Connections</span>
              </h2>
              <p className="text-slate-600 text-lg max-w-xl">
                See what's happening at Balaji Hospital. We share patient recoveries, health tips, and a behind-the-scenes look at our medical excellence.
              </p>
            </div>

            {/* Instagram Section */}
            <div className="space-y-8">
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-1 shadow-lg">
                    <div className="w-full h-full rounded-full bg-white p-0.5">
                      <div className="w-full h-full rounded-full bg-medical-600 flex items-center justify-center text-white font-bold text-xl font-poppins">
                        B
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 leading-none flex items-center gap-1.5 font-poppins">
                      balajihospitaljaipur
                      <span className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">2.4k followers • {loading ? '...' : '156+'} posts</p>
                  </div>
                </div>
                <a 
                  href="https://www.instagram.com/balajihospitaljaipur/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-8 py-3 bg-medical-600 text-white text-sm font-bold rounded-2xl hover:bg-medical-700 transition-all shadow-lg shadow-medical-100 transform hover:-translate-y-0.5"
                >
                  Follow
                </a>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {posts.map((post: any, idx) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => post.permalink && window.open(post.permalink, '_blank')}
                    className={cn(
                        "group relative aspect-square rounded-[2.2rem] overflow-hidden cursor-pointer shadow-xl border border-slate-100",
                        loading && "animate-pulse bg-slate-100"
                    )}
                  >
                    {!loading && (
                      <>
                        <Image
                          src={post.image}
                          alt={`Instagram post: ${post.caption.slice(0, 50)}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          sizes="(max-width: 1024px) 45vw, 20vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end text-white">
                          <p className="text-[11px] font-medium mb-4 line-clamp-3 leading-relaxed">
                            {post.caption}
                          </p>
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-tighter">
                              <Heart className="w-5 h-5 fill-current text-rose-500" />
                              <span>{post.likes}</span>
                            </div>
                            <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-tighter">
                              <MessageCircle className="w-5 h-5 fill-current text-sky-400" />
                              <span>{post.comments}</span>
                            </div>
                          </div>
                        </div>
                        {post.type === "video" && (
                          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full">
                            <Play className="w-4 h-4 text-white fill-current" />
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: YouTube & Facebook */}
          <div className="w-full lg:w-[450px] space-y-12">
            {/* YouTube Highlights */}
            <div className="bg-slate-50 rounded-[3rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/5 rounded-full blur-3xl" />
               
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-xl shadow-red-100">
                    <Youtube className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Health Channel</h4>
                    <p className="text-xs text-slate-500">Video Consultations</p>
                  </div>
                </div>
                <a 
                  href="https://www.youtube.com/@balajihospitaljaipur" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-slate-400 hover:text-red-600 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="space-y-8 relative z-10">
                {youtubeVideos.map((video) => (
                  <div key={video.id} className="group cursor-pointer">
                    <div className="relative aspect-video rounded-[1.5rem] overflow-hidden mb-4 shadow-2xl">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 1024px) 90vw, 350px"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-300 shadow-2xl">
                          <Play className="w-6 h-6 text-red-600 fill-current ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white">
                        {video.duration}
                      </div>
                    </div>
                    <h5 className="font-bold text-slate-800 leading-snug group-hover:text-medical-600 transition-colors line-clamp-2">
                      {video.title}
                    </h5>
                    <div className="flex items-center gap-3 mt-2 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                      <span>{video.views} Views</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span>{video.id === "w_nDMzNpT24" ? "Featured" : "Latest"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Facebook Latest Post Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-2xl relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border-2 border-blue-600 p-0.5">
                    <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                      B
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 leading-none">{facebookPost.author}</h4>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">{facebookPost.date}</p>
                  </div>
                </div>
                <Facebook className="w-6 h-6 text-blue-600 fill-current" />
              </div>

              <div className="mb-6">
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  {facebookPost.content}
                </p>
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg">
                  <Image
                    src={facebookPost.image}
                    alt="Facebook post from Balaji Hospital"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 90vw, 350px"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div className="flex items-center gap-4 text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-xs font-bold">{facebookPost.likes}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-xs font-bold">{facebookPost.comments}</span>
                  </div>
                </div>
                <a 
                  href="https://www.facebook.com/balajihospitaljaipur/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 hover:gap-3 transition-all"
                >
                  View Post
                  <Share2 className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
