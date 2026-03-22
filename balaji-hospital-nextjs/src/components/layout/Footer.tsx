"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, HeartPulse } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  if (pathname === '/doctor' || pathname?.startsWith('/doctor/')) return null;

  return (
    <footer className="bg-slate-900 pt-24 pb-12 text-slate-400">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-medical-600 rounded-lg flex items-center justify-center text-white">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-lg font-display font-bold text-white leading-none">Balaji Hospital</span>
                <span className="text-[10px] text-medical-400 font-bold uppercase tracking-wider mt-0.5">& Orthopaedic Centre</span>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.15em] mt-0.5">Serving Since 1996</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Balaji Hospital and Orthopaedic Centre is the best orthopaedic and ENT hospital of Jaipur serving since 1996 with best care and technology.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Facebook, href: "https://www.facebook.com/balajihospitaljaipur/", label: "Facebook" },
                { Icon: Instagram, href: "https://www.instagram.com/balajihospitaljaipur/", label: "Instagram" },
                { Icon: Youtube, href: "https://www.youtube.com/@balajihospitaljaipur", label: "YouTube" },
              ].map(({ Icon, href, label }) => (
                <a 
                  key={label} 
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${label}`}
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-medical-600 hover:text-white transition-all transform hover:-translate-y-1 min-w-[44px] min-h-[44px]"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              {[
                { name: "About Us", href: "/about" },
                { name: "Our Doctors", href: "/doctors" },
                { name: "Departments", href: "/departments" },
                { name: "Facilities", href: "/facilities" },
                { name: "Gallery", href: "/gallery" },
                { name: "Contact Us", href: "/appointment" }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-medical-400 transition-colors inline-block">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Specialties</h4>
            <ul className="space-y-4 text-sm">
              {[
                { name: "Spine Treatment", href: "/departments/orthopedic/spine-treatment" },
                { name: "Knee Replacement", href: "/departments/orthopedic/knee-replacement" },
                { name: "Hip Replacement", href: "/departments/orthopedic/hip-replacement" },
                { name: "Ear Surgery", href: "/departments/ent/ear-surgery" },
                { name: "Kidney Stones", href: "/departments/speciality/kidney-stones" },
                { name: "Physiotherapy", href: "/orthopedic/physiotherapy-and-rehabilitation-centre-in-jaipur" }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-medical-400 transition-colors inline-block">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Contact Info</h4>
            <ul className="space-y-5 text-sm">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-medical-500" />
                </div>
                <span>27, Ratan Nagar, Dher Ke Balaji, Sikar Road, Jaipur, Rajasthan. 302039</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-medical-500" />
                </div>
                <a href="tel:+917276229049" className="hover:text-white transition-colors">+91 7276229049</a>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-medical-500" />
                </div>
                <a href="mailto:info@balajihospitaljaipur.com" className="hover:text-white transition-colors">info@balajihospitaljaipur.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm">
            © {new Date().getFullYear()} Balaji Hospital & Orthopaedic Centre. All rights reserved. <br className="md:hidden" />
            <span className="text-medical-400 font-bold ml-0 md:ml-4">Single Location Hospital — No Branches Anywhere Else</span>
          </p>
          <div className="flex gap-8 text-sm">
            <Link href="/contact" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
