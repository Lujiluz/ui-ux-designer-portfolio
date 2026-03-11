"use client";

import { motion } from "framer-motion";

const skills = [
  "USER INTERFACE (UI)",
  "RESEARCH",
  "4+ YEARS EXPERIENCE",
  "PROBLEM SOLVING",
  "CRITICAL THINKING",
  "COMMUNICATION & COLLABORATION",
];

const SkillsSection = () => {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12" id="skills">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-8">Skills</h2>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-foreground text-sm font-body rounded-sm border border-border"
            >
              <span className="text-primary">✦</span>
              {skill}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
