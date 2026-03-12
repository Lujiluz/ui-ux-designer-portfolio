"use client";

import { motion, Variants } from "framer-motion";

// ─── Data Structure ──────────────────────────────────────────────────────────

const skillCategories = [
  {
    title: "Design Skills",
    skills: [
      "MOBILE APP DESIGN",
      "USER INTERFACE (UI) DESIGN",
      "USER EXPERIENCE (UX) DESIGN",
      "WIREFRAMING & PROTOTYPING",
      "USABILITY TESTING",
      "INFORMATION ARCHITECTURE",
      "DESIGN SYSTEM",
      "RESPONSIVE DESIGN",
      "WEB DESIGN",
      "USER RESEARCH",
    ],
  },
  {
    title: "Soft Skills",
    skills: [
      "COMMUNICATION",
      "COLLABORATION", // Typo fixed here
      "PROBLEM SOLVING",
      "CRITICAL THINKING",
      "TIME MANAGEMENT",
    ],
  },
  {
    title: "Tools",
    skills: ["FIGMA", "CANVA", "FIGJAM"],
  },
];

// ─── Animation Variants ──────────────────────────────────────────────────────

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Jeda kemunculan antar kategori
    },
  },
};

const categoryVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.05, // Jeda kemunculan antar pill skill
    },
  },
};

const pillVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

const SkillsSection = () => {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-[#121212]" id="skills">
      <div className="container mx-auto">
        {/* Header Section */}
        <p className="text-sm md:text-base text-foreground mb-12 font-body tracking-wide">Skills</p>

        {/* Categories Wrapper */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-15%" }} className="space-y-12">
          {skillCategories.map((category, i) => (
            <motion.div key={i} variants={categoryVariants} className="space-y-6">
              {/* Category Title */}
              <motion.h3 variants={pillVariants} className="text-xl md:text-2xl font-heading font-bold text-primary">
                {category.title}
              </motion.h3>

              {/* Skills Pills Container */}
              <div className="flex flex-wrap gap-3 md:gap-4">
                {category.skills.map((skill, j) => (
                  <motion.div
                    key={j}
                    variants={pillVariants}
                    whileHover={{ scale: 1.05, y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    // Styling mirip dengan project cards: dark background, subtle border
                    className="flex items-center gap-3 px-4 py-3 md:px-5 md:py-3.5 bg-[#1a1c18] border border-white/10 rounded-xl cursor-default group hover:border-white/20 hover:bg-[#22251f] transition-colors"
                  >
                    {/* Green Dot Indicator */}
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0 group-hover:shadow-[0_0_8px_rgba(var(--primary-rgb),0.6)] transition-shadow" />

                    {/* Skill Text */}
                    <span className="text-xs md:text-sm font-semibold text-foreground/90 tracking-wide">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
