"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Zap, ChevronRight } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "Log in", href: "/login" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-black/60 backdrop-blur-xl py-3"
          : "border-b border-transparent bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5 transition-transform hover:scale-[1.02]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-900 shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-shadow group-hover:shadow-[0_0_25px_rgba(239,68,68,0.5)]">
            <Zap size={20} className="fill-white text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">FlowTrack</span>
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/register"
            className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-white px-6 py-2.5 text-sm font-bold text-black transition-all hover:pr-8 active:scale-95"
          >
            <span className="relative z-10">Get Started</span>
            <ChevronRight 
              size={16} 
              className="absolute right-3 opacity-0 transition-all group-hover:opacity-100" 
            />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 md:hidden"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/95 transition-all duration-500 md:hidden ${
          isOpen ? "opacity-100 backdrop-blur-2xl pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
        
        <div className="flex flex-col items-center gap-8 px-6 text-center">
          {navLinks.map((link, i) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`text-3xl font-bold text-white transition-all duration-300 ${
                isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/register"
            onClick={() => setIsOpen(false)}
            className={`mt-4 rounded-full bg-gradient-to-br from-red-600 to-red-900 px-8 py-4 text-xl font-bold text-white shadow-lg shadow-red-900/40 transition-all duration-300 hover:scale-105 active:scale-95 ${
              isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: `${navLinks.length * 100}ms` }}
          >
            Get Started Free
          </Link>
        </div>

        {/* Decorative elements for mobile menu */}
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-red-900/20 blur-[100px]" />
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-red-900/10 blur-[100px]" />
      </div>
    </nav>
  );
}
