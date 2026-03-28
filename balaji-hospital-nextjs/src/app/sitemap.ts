import { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog";
import { services } from "@/data/services";
import { doctors } from "@/data/doctors";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://balajihospitaljaipur.com";

  // Static routes
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/appointment",
    "/doctors",
    "/facilities",
    "/gallery",
    "/departments",
    "/blog",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic Department/Service routes
  const serviceRoutes = services.map((service) => ({
    url: `${baseUrl}${service.url}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Dynamic Blog routes
  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Dynamic Doctor routes
  const doctorRoutes = doctors.map((doctor) => ({
    url: `${baseUrl}/doctors/${doctor.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...blogRoutes, ...doctorRoutes];
}
