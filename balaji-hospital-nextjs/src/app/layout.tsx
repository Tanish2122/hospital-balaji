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
  title: "Balaji Hospital & Orthopaedic Centre | Best Orthopedic & ENT Hospital in Jaipur",
  description: "Balaji Hospital & Orthopaedic Centre, Jaipur — serving since 1996 with expert orthopedic, ENT, and speciality care. 24/7 emergency. Call +91 7276229049.",
  keywords: [
    "best orthopedic hospital jaipur",
    "ent hospital jaipur",
    "spine treatment jaipur",
    "knee replacement jaipur",
    "hip replacement jaipur",
    "balaji hospital jaipur",
    "orthopaedic surgeon jaipur",
    "fracture treatment jaipur",
    "physiotherapy jaipur",
    "24 7 emergency hospital jaipur",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://balajihospitaljaipur.com/",
  },
  openGraph: {
    type: "website",
    url: "https://balajihospitaljaipur.com/",
    title: "Balaji Hospital & Orthopaedic Centre | Best Orthopedic & ENT Hospital in Jaipur",
    description: "Expert orthopedic, ENT, and speciality care in Jaipur since 1996. 24/7 emergency services. Senior consultants with 25+ years experience.",
    images: [{ url: "https://balajihospitaljaipur.com/uploads/logo/6864d3c756898.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Balaji Hospital & Orthopaedic Centre | Best Orthopedic & ENT Hospital in Jaipur",
    description: "Expert orthopedic, ENT, and speciality care in Jaipur since 1996. 24/7 emergency services.",
    images: ["https://balajihospitaljaipur.com/uploads/logo/6864d3c756898.png"],
  },
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
