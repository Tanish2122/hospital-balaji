"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Menu, X, ChevronRight } from "lucide-react";
import Logo from "../ui/Logo";

const navLinks = [
  { name: "About", href: "/about" },
  { name: "Doctors", href: "/doctors" },
  { name: "Departments", href: "/departments" },
  { name: "Facilities", href: "/facilities" },
  { name: "Gallery", href: "/gallery" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Emergency Top Bar */}
      <div className="bg-red-600 text-white py-2 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex justify-center items-center gap-4 text-sm font-semibold tracking-wide">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
              24/7 EMERGENCY
            </span>
            <span className="hidden sm:block opacity-60">|</span>
            <a href="tel:+917276229049" className="hover:underline flex items-center gap-2">
              <Phone className="w-4 h-4" /> +91 7276229049
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div 
        className={`transition-all duration-300 ${
          isScrolled 
            ? "bg-white/80 backdrop-blur-lg border-b border-slate-200 py-3 shadow-sm" 
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Logo />

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-sm font-semibold text-slate-700 hover:text-medical-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <button className="bg-medical-600 hover:bg-medical-700 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-medical-500/20 active:scale-95">
              Book Appointment
            </button>
          </nav>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden p-2 text-slate-900 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay - Off-canvas backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel - Slide-in from right */}
      <div 
        className={`fixed top-0 right-0 h-full w-[85%] max-w-sm z-50 bg-white shadow-2xl lg:hidden transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full bg-white relative">
          {/* Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <span className="text-xl font-bold text-slate-900">Menu</span>
            <button 
              className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors focus:outline-none"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Links */}
          <div className="flex-1 overflow-y-auto py-6 px-6">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-semibold text-slate-700 py-3 border-b border-slate-50 flex items-center justify-between group hover:text-medical-600 transition-colors"
                >
                  {link.name}
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-medical-500 transition-colors" />
                </Link>
              ))}
            </nav>
            
            <div className="mt-10 space-y-4">
              <button className="w-full bg-medical-600 hover:bg-medical-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-medical-500/20 transition-all active:scale-95">
                Book Appointment
              </button>
              <a href="tel:+917276229049" className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-colors">
                <Phone className="w-5 h-5" /> Emergency Call
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
