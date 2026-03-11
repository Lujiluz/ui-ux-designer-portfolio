"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section
      id="introduction"
      className="sticky top-0 z-0 min-h-screen flex items-center overflow-x-clip"
      style={{
        backgroundImage: `url(/images/topographic.svg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "var(--void)",
      }}
    >
      <div className="container mx-auto pt-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <span className="inline-block text-sm font-heading font-semibold text-primary mb-4">UI/UX Designer</span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-foreground leading-tight mb-6">
              Hi, I&apos;m
              <br />
              Rima Zakiyatin Arifah
              <span className="inline-block ml-2">👋</span>
            </h1>
            <p className="text-muted-foreground font-body text-base md:text-lg max-w-lg leading-relaxed">
              I&apos;m a UI/UX Designer with over 4 years of experience in crafting intuitive interfaces and enhancing satisfying user experiences. With a strong background in interactive design and a user-centric approach, I have
              contributed to various projects, helping them achieve business goals through effective design solutions.
            </p>
          </motion.div>

          {/* Right - Avatar */}
          <motion.div className="flex justify-center md:justify-end" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.4 }}>
            <Image src="/images/avatar_2.png" alt="Rima Zakiyatin Arifah - 3D Avatar" width={480} height={480} priority className="w-64 md:w-80 lg:w-105" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
