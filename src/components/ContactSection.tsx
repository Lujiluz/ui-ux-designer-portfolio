"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { Mail } from "lucide-react";
import { Whatsapp } from "./ui/icons";

// ─── Animation Variants ──────────────────────────────────────────────────────

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

const ContactSection = () => {
  return (
    <section id="contact" className="relative py-20 md:py-32 px-6 md:px-12 bg-[#121212] overflow-hidden">
      {/* Background Graphic Element 
        Pastikan lu export abstract line hijaunya dari Figma jadi SVG,
        terus simpen di /public/images/abstract-lines.svg
      */}
      <div className="absolute top-0 right-[-10%] md:right-0 w-full md:w-[50%] h-full opacity-50 md:opacity-100 pointer-events-none flex justify-end items-center z-0">
        <div className="relative w-full h-[150%] max-w-200">
          {/* Ganti src ini kalau nama file lu beda */}
          <Image src="/images/abstract-lines.svg" alt="Abstract background" fill className="object-cover object-right md:object-contain" />
        </div>
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="max-w-3xl flex flex-col items-start">
          {/* Section Subtitle */}
          <motion.p variants={itemVariants} className="text-sm md:text-base text-muted-foreground mb-4 font-body tracking-wide">
            Let&apos;s work
          </motion.p>

          {/* Main Title */}
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6">
            Let&apos;s Work Together
          </motion.h2>

          {/* Subheading */}
          <motion.h3 variants={itemVariants} className="text-2xl md:text-3xl lg:text-4xl font-heading text-foreground mb-8">
            Have an idea in mind? Let&apos;s bring it to <span className="font-bold text-primary">DESIGN</span>.
          </motion.h3>

          {/* Description Paragraph */}
          <motion.div variants={itemVariants} className="text-sm md:text-base text-muted-foreground font-body leading-relaxed mb-10 space-y-4 max-w-2xl">
            <p>
              I help businesses and startups transform ideas into intuitive, user-friendly, and impactful digital experiences. Whether you need UI/UX design, product design, or a complete digital interface, I&apos;m here to help create
              solutions that truly work for your users.
            </p>
            <p>If you&apos;re looking for a designer who values clarity, usability, and meaningful design, let&apos;s start a conversation.</p>
          </motion.div>

          {/* Contact Info (Email & Phone) */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12">
            {/* Email */}
            <a href="mailto:rimazakiyatin@gmail.com" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors group">
              <Mail className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
              <span className="text-sm md:text-base font-bold font-body">rimazakiyatin@gmail.com</span>
            </a>

            {/* Phone / WA */}
            <a href="https://wa.me/6283821920986" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors group">
              <Whatsapp className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
              <span className="text-sm md:text-base font-bold font-body">+(62)838-219-209-86</span>
            </a>
          </motion.div>

          {/* Neo-brutalist CTA Button */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ x: 2, y: 2, boxShadow: "0px 0px 0px rgba(0,0,0,1)" }}
            className="px-5 py-4 text-xs font-bold bg-primary text-black rounded-lg border border-black shadow-[6px_6px_0px_rgba(85,85,85,1)] tracking-wide transition-shadow cursor-pointer"
          >
            <a className="px-6 py-3.5 md:px-8 md:py-4 text-xs md:text-sm font-bold">LET&apos;S WORK TOGETHER</a>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
