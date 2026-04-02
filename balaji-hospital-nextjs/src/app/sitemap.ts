import { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog";
import { doctors } from "@/data/doctors";
import { orthopedicSeoSlugs, entSeoSlugs, specialitySeoSlugs } from "@/data/seoSlugMap";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://balajihospitaljaipur.com";
  const now = new Date();

  // ── High-priority static pages ────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl,                      lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${baseUrl}/about`,           lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/doctors`,         lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${baseUrl}/appointment`,     lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${baseUrl}/facilities`,      lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/gallery`,         lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/blog`,            lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${baseUrl}/contact`,         lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/departments`,     lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  // ── New SEO category pages (high priority) ────────────────────────────
  const categoryRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/orthopedic`,  lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/ent`,         lastModified: now, changeFrequency: "weekly", priority: 0.9  },
    { url: `${baseUrl}/speciality`,  lastModified: now, changeFrequency: "weekly", priority: 0.85 },
  ];

  // ── Orthopedic service pages (/orthopedic/[seo-slug]) ─────────────────
  const orthopedicRoutes: MetadataRoute.Sitemap = Object.keys(orthopedicSeoSlugs).map((slug) => ({
    url: `${baseUrl}/orthopedic/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  // ── ENT service pages (/ent/[seo-slug]) ───────────────────────────────
  const entRoutes: MetadataRoute.Sitemap = Object.keys(entSeoSlugs).map((slug) => ({
    url: `${baseUrl}/ent/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  // ── Speciality service pages (/speciality/[seo-slug]) ─────────────────
  const specialityRoutes: MetadataRoute.Sitemap = Object.keys(specialitySeoSlugs).map((slug) => ({
    url: `${baseUrl}/speciality/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  // ── Blog routes ───────────────────────────────────────────────────────
  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // ── Doctor profile routes ─────────────────────────────────────────────
  const doctorRoutes: MetadataRoute.Sitemap = doctors.map((doctor) => ({
    url: `${baseUrl}/doctors/${doctor.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...orthopedicRoutes,
    ...entRoutes,
    ...specialityRoutes,
    ...blogRoutes,
    ...doctorRoutes,
  ];
}
