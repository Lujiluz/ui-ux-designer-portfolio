"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRef } from "react";

const HeroCursor = dynamic(() => import("@/components/hero-cursor"), {
  ssr: false,
});

// 1. Variant Teks: Cepat, tajam, jarak y pendek biar ga kerasa "lelet"
const snappyText: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 150, // Makin tinggi = makin cepet/snappy
      damping: 20, // Nahan biar ga mantul berlebihan
      mass: 0.5, // Bikin elemen kerasa lebih "ringan"
      delay,
    },
  }),
};

// 2. Variant Lingkaran: Efek mekar (scale up) yang mulus
const circleRipple: Variants = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 25,
      delay,
    },
  }),
};

// 3. Variant Avatar: Pop up dari bawah dengan sedikit efek scale
const avatarPop: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 20,
      delay: 0.4, // Muncul tepat setelah nama
    },
  },
};

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <>
      <HeroCursor containerRef={sectionRef} />
      <section
        ref={sectionRef}
        id="introduction"
        className="sticky top-0 z-0 min-h-[180vh] flex items-start overflow-x-clip"
        style={{
          backgroundImage: `url(/images/topographic.svg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "var(--void)",
        }}
      >
        <div className="container mx-auto pt-40">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="flex flex-col items-start">
              {/* Muncul paling pertama (0.1s) */}
              <motion.span custom={0.1} variants={snappyText} initial="hidden" animate="visible" className="inline-block text-lg font-heading font-semibold text-primary mb-4">
                UI/UX Designer
              </motion.span>

              {/* Muncul kedua (0.2s) */}
              <motion.h1 custom={0.2} variants={snappyText} initial="hidden" animate="visible" className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-foreground leading-tight mb-6">
                Hi, I&apos;m
                <br />
                <span className="text-primary">Rima</span> Zakiyatin Arifah
                <span className="inline-block ml-2">👋</span>
              </motion.h1>

              {/* Muncul terakhir sebagai penutup (0.7s) setelah visual beres */}
              <motion.p custom={0.7} variants={snappyText} initial="hidden" animate="visible" className="text-muted-foreground font-body text-base md:text-lg max-w-lg leading-relaxed">
                I am a UI/UX Designer with over <strong className="text-foreground">4 years of experience</strong> in crafting intuitive interfaces and delivering satisfying user experiences. With a strong background in interactive design and
                a user-centered approach, I have contributed to various projects, helping them <strong className="text-foreground">achieve business goals through effective design solutions.</strong>
              </motion.p>
            </div>

            {/* Right Content - Avatar & Circles */}
            <div className="flex justify-center md:justify-end relative">
              <div className="relative w-75 h-75 md:w-100 md:h-100 flex items-center justify-center mt-12 md:mt-0">
                {/* Lingkaran Luar - Ripple 1 (0.4s) */}
                <motion.div custom={0.4} variants={circleRipple} initial="hidden" animate="visible" className="absolute w-full h-full rounded-full bg-[#1e2a16]" />

                {/* Lingkaran Dalam - Ripple 3 (0.6s) */}
                <motion.div custom={0.5} variants={circleRipple} initial="hidden" animate="visible" className="absolute w-[80%] h-[80%] rounded-full bg-primary" />

                {/* 3D Avatar - Pop (0.3s) */}
                <motion.div variants={avatarPop} initial="hidden" animate="visible" className="relative z-10 flex justify-center items-end">
                  <Image src="/images/3d_avatar.svg" alt="Rima Zakiyatin Arifah - 3D Avatar" width={380} height={380} priority className="w-72 md:w-96 drop-shadow-2xl translate-y-4" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
