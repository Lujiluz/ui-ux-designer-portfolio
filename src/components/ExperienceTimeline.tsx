"use client";

import { motion, Variants } from "framer-motion";

const experiences = [
  {
    company: "Telkom Direktorat Digital Business",
    period: "January - June 2020",
    type: "(Internship)",
  },
  {
    company: "Reka Cipta Digital",
    period: "March 2021 - June 2023",
    type: "(fulltime)",
  },
  {
    company: "PT Kreasindo Karya Abadi",
    period: "April 2024 - Present",
    type: "(fulltime)",
  },
];

// Animasi untuk container utama (Pill)
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2, // Efek muncul berurutan untuk tiap item
    },
  },
};

// Animasi untuk masing-masing item di dalam container
const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

const ExperienceTimeline = () => {
  return (
    <section id="projectsexperiences" className="py-16 md:py-24 px-6 md:px-12 bg-[#121212]">
      <div className="container mx-auto">
        <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2 font-body">Project & Experience</p>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-12">Experience since 2020 - Present</h2>

        {/* Container Pill Horizontal */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-15%" }}
          // Menggunakan bg-white/5 dan backdrop-blur agar pas dengan tema dark neo-brutalism
          className="w-full bg-[#1a1c18] border border-white/5 rounded-[32px] md:rounded-xl p-8 md:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 lg:gap-4"
        >
          {experiences.map((exp, i) => (
            <motion.div key={i} variants={itemVariants} className="flex items-center gap-4 lg:gap-5 w-full">
              {/* Halo Dot Icon */}
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <div className="w-6 h-6 rounded-full bg-primary shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
              </div>

              {/* Text Container */}
              <div className="flex flex-col gap-1">
                <h3 className="font-heading font-bold text-foreground text-lg md:text-xl tracking-wide">{exp.company}</h3>
                <p className="text-sm md:text-base text-muted-foreground font-body">
                  {exp.period} <span className="font-bold text-foreground/90">{exp.type}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceTimeline;
