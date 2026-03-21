"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Phone, Menu, X, ChevronRight, Calendar } from "lucide-react";
import Logo from "../ui/Logo";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Doctors", href: "/doctors" },
  { name: "Departments", href: "/departments" },
  { name: "Facilities", href: "/facilities" },
  { name: "Gallery", href: "/gallery" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/appointment" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    // Passive listener for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Emergency Top Bar */}
      <div className="bg-red-600 text-white py-1 sm:py-2 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-center items-center gap-3 sm:gap-4 text-[10px] sm:text-sm font-semibold tracking-wide">
            <span className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-ping"></span>
              24/7 EMERGENCY
            </span>
            <span className="hidden xs:block opacity-60">|</span>
            <a href="tel:+917276229049" className="hover:underline flex items-center gap-1.5 sm:gap-2 whitespace-nowrap" aria-label="Call emergency number">
              <Phone className="w-3 h-3 sm:w-4 sm:h-4" /> +91 7276229049
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
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-sm font-semibold text-slate-700 hover:text-medical-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link 
              href="/appointment"
              className="hidden lg:flex items-center gap-2 bg-medical-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-medical-700 transition-all shadow-lg shadow-medical-200 active:scale-95"
            >
              <Calendar className="w-5 h-5" />
              <span>Book Appointment</span>
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden p-2 text-slate-900 focus:outline-none min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-[85%] max-w-sm z-50 bg-white shadow-2xl lg:hidden transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Mobile navigation menu"
      >
        <div className="flex flex-col h-full bg-white relative">
          {/* Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <span className="text-xl font-bold text-slate-900">Menu</span>
            <button 
              className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors focus:outline-none min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={closeMobileMenu}
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Links */}
          <div className="flex-1 overflow-y-auto py-6 px-6">
            <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="text-lg font-semibold text-slate-700 py-3 border-b border-slate-50 flex items-center justify-between group hover:text-medical-600 transition-colors min-h-[48px]"
                >
                  {link.name}
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-medical-500 transition-colors" />
                </Link>
              ))}
            </nav>
            
            <div className="mt-10 space-y-4">
              <Link 
                href="/appointment"
                onClick={closeMobileMenu}
                className="w-full bg-medical-600 hover:bg-medical-700 text-white py-4 rounded-xl font-bold text-center text-lg shadow-lg shadow-medical-500/20 transition-all active:scale-95 block min-h-[48px] flex items-center justify-center"
              >
                Book Appointment
              </Link>
              <a href="tel:+917276229049" className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-colors min-h-[48px]">
                <Phone className="w-5 h-5" /> Emergency Call
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
