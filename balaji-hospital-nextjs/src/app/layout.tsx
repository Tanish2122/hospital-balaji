import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

import Schema from "@/components/ui/Schema";
import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0284c7",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://balajihospitaljaipur.com"),
  title: {
    template: "%s | Balaji Hospital & Orthopaedic Centre Jaipur",
    default: "Balaji Hospital & Orthopaedic Centre | Best Orthopedic & ENT Hospital in Jaipur",
  },
  description: "Balaji Hospital & Orthopaedic Centre Jaipur. Expert orthopedic & ENT care since 1996. 24/7 emergency services. Senior consultants for knee, hip replacement & spine surgery. Top-rated specialists in Jaipur.",
  keywords: [
    "best hospital in jaipur",
    "orthopedic hospital in jaipur",
    "best orthopedic surgeon jaipur",
    "ent specialist in jaipur",
    "best ent hospital jaipur",
    "knee replacement jaipur",
    "hip replacement jaipur",
    "spine surgery jaipur",
    "urologist in jaipur",
    "kidney stone treatment jaipur",
    "24/7 emergency jaipur",
    "balaji hospital jaipur",
    "physiotherapy centre jaipur",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://balajihospitaljaipur.com/",
  },
  openGraph: {
    type: "website",
    url: "https://balajihospitaljaipur.com/",
    title: "Balaji Hospital & Orthopaedic Centre | Best Orthopedic & ENT Hospital in Jaipur",
    description: "Expert orthopedic, ENT, and urology care in Jaipur since 1996. 24/7 emergency services. Senior consultants with 25+ years experience. Modern fracture care & replacements.",
    siteName: "Balaji Hospital Jaipur",
    images: [{ 
      url: "https://balajihospitaljaipur.com/uploads/logo/6864d3c756898.png",
      width: 1200,
      height: 630,
      alt: "Balaji Hospital & Orthopaedic Centre Jaipur Logo"
    }],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Balaji Hospital & Orthopaedic Centre | Best Orthopedic & ENT Hospital in Jaipur",
    description: "Jaipur's leading centre for Orthopedic & ENT care. 24/7 emergency and expert surgeries since 1996.",
    images: ["https://balajihospitaljaipur.com/uploads/logo/6864d3c756898.png"],
    creator: "@balajihospital",
  },
  category: "medical",
};

import MobileBottomNav from "@/components/layout/MobileBottomNav";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="dns-prefetch" href="https://balajihospitaljaipur.com" />
        <link rel="preconnect" href="https://balajihospitaljaipur.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <Schema />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased text-slate-900`}>
        <Header />
        {children}
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
