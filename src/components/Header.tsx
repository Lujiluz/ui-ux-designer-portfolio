"use client";

import { useState, useEffect, useRef } from "react";
import { useLenis } from "@/context/LenisContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Mail, Whatsapp } from "./ui/icons";

const navItems = [
  { label: "Introduction", href: "/" },
  { label: "Projects & Experiences", href: "/" },
  { label: "Skills", href: "/" },
  { label: "Let's work", href: "/" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lenis = useLenis();
  const navigatingRef = useRef<boolean>(false);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function scrollToSection(href: string) {
    if (!lenis) return;
    // Set BEFORE lenis.scrollTo() — onScroll may fire on the very next tick
    navigatingRef.current = true;
    fallbackTimerRef.current = setTimeout(() => {
      navigatingRef.current = false;
    }, 2000);
    lenis.scrollTo(href, {
      onComplete: () => {
        navigatingRef.current = false;
        if (fallbackTimerRef.current) {
          clearTimeout(fallbackTimerRef.current);
          fallbackTimerRef.current = null;
        }
      },
    });
  }

  useEffect(() => {
    const onScroll = () => {
      // Hide as soon as the user starts scrolling; show again only near the very top
      if (window.scrollY > 60 && !navigatingRef.current) {
        setHidden(true);
        setIsOpen(false);
      } else if (window.scrollY <= 60) {
        setHidden(false);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    };
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: hidden ? 0 : 1, y: hidden ? -80 : 0 }}
      style={{ pointerEvents: hidden ? "none" : "auto" }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.15, 1] }}
      className="fixed bg-primary-foreground top-0 left-0 right-0 z-50 w-full border-b border-t-text-secondary/20 shadow-xl shadow-[#00000040]"
    >
      {/* welcome message along with contacts */}
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-3 md:gap-0 px-4 md:px-12 py-2.5 text-xs md:text-sm border-b border-b-text-secondary/20">
        <p className="text-center">👋 Hi, welcome to Rima’s Portofolio</p>

        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          {/* Email Wrapper */}
          <div className="flex items-center gap-1.5">
            <Mail className="text-white w-4 h-4 md:w-5 md:h-5" />
            <span>rimazakiyatin@gmail.com</span>
          </div>

          {/* WhatsApp Wrapper */}
          <div className="flex items-center gap-1.5">
            <Whatsapp className="text-white w-4 h-4 md:w-5 md:h-5" />
            {/* Btw, ini teksnya sama-sama email, kalau mau diganti nomor WA tinggal ubah bagian ini ya */}
            <span>rimazakiyatin@gmail.com</span>
          </div>
        </div>
      </div>
      {/* ── Desktop / Mobile bar ── */}
      <div className="flex items-center justify-between px-8 md:px-14 py-6">
        {/* Logo */}
        <div className="w-9 h-9 flex items-center justify-center shrink-0">
          <Image src="/images/navbar_icon.svg" width={52} height={52} alt="Logo Image" />
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navItems.map((item) => (
            <button key={item.label} onClick={() => scrollToSection(item.href)} className="text-sm text-foreground hover:text-foreground transition-colors duration-200 font-body px-4 py-2 rounded-xl hover:bg-white/[0.07]">
              {item.label}
            </button>
          ))}
        </nav>

        {/* ── Hamburger (mobile) ── */}
        <button onClick={() => setIsOpen((o) => !o)} aria-label={isOpen ? "Close menu" : "Open menu"} aria-expanded={isOpen} className="md:hidden relative flex items-center justify-center w-9 h-9 focus:outline-none">
          {/*
            Icon canvas: 22 × 14 px
            Line 1 center: y=1   → moves to y=7  (+6)
            Line 3 center: y=13  → moves to y=7  (-6)
          */}
          <div className="relative w-5.5 h-3.5">
            {/* Line 1 — full width */}
            <motion.span
              className="absolute right-0 h-0.5 rounded-full bg-foreground"
              initial={false}
              animate={isOpen ? { rotate: 45, y: 6, width: 22 } : { rotate: 0, y: 0, width: 22 }}
              style={{ top: 0, width: 22 }}
              transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            />
            {/* Line 2 — short, collapses out */}
            <motion.span
              className="absolute right-0 h-0.5 rounded-full bg-muted-foreground"
              initial={false}
              animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              style={{ top: 6, width: 14, transformOrigin: "right center" }}
              transition={{ duration: 0.18 }}
            />
            {/* Line 3 — medium width */}
            <motion.span
              className="absolute right-0 h-0.5 rounded-full bg-foreground"
              initial={false}
              animate={isOpen ? { rotate: -45, y: -6, width: 22 } : { rotate: 0, y: 0, width: 18 }}
              style={{ bottom: 0, width: 18 }}
              transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
        </button>
      </div>

      {/* ── Mobile dropdown (glass panel, only on mobile) ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.26, ease: [0.32, 0, 0.2, 1] }}
            className="mx-4 mb-4 rounded-2xl overflow-hidden md:hidden"
            style={{
              background: "rgba(255,255,255,0.055)",
              backdropFilter: "blur(28px) saturate(180%)",
              WebkitBackdropFilter: "blur(28px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 12px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.09)",
            }}
          >
            {/* Top specular */}
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/50 to-transparent" />

            <nav className="relative flex flex-col py-1.5">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.label}
                  onClick={() => {
                    scrollToSection(item.href);
                    setIsOpen(false);
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.22 }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body px-5 py-4 hover:bg-white/6 border-b border-white/6 last:border-0 w-full text-left"
                >
                  {item.label}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
