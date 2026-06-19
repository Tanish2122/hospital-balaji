import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import Script from "next/script";
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
    template: "%s | Balaji Hospital Jaipur",
    default: "Balaji Hospital | Best Orthopedic & ENT Hospital in Jaipur",
  },
  description: "Balaji Hospital Jaipur — Jaipur's trusted choice for Orthopedic, ENT, and Speciality care since 1996. Top-rated surgeons for knee & hip surgery.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
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
    canonical: "/",
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
  verification: {
    google: "f7QrUWFnixHGMb6BEGMU1kDN0_92byk2zSGcNraVqrU",
  },
};

import MobileBottomNav from "@/components/layout/MobileBottomNav";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConsultationPopup from "@/components/ConsultationPopup";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Preconnect to Supabase and Google Fonts CDN for faster loads */}
        <link rel="preconnect" href="https://yroieafhxcorwitzwyjj.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://yroieafhxcorwitzwyjj.supabase.co" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <Schema />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased text-slate-900`}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-10WGZCDBWB"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-10WGZCDBWB');
          `}
        </Script>
        <Header />
        {children}
        <Footer />
        <MobileBottomNav />
        <ConsultationPopup />
      </body>
    </html>
  );
}
