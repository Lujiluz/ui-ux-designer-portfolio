"use client";

import { motion } from "framer-motion";

const experiences = [
  {
    company: "Telkom Direktorat Digital Business",
    role: "Intern - Internship",
    period: "Jan 2021 - Jun 2021",
  },
  {
    company: "Reka Cipta Digital",
    role: "UI/UX Designer",
    period: "Mar 2021 - Jun 2024",
  },
  {
    company: "PT Kreasindo Karya Abadi",
    role: "UI/UX Designer",
    period: "Jun 2024 - Present",
  },
];

const ExperienceTimeline = () => {
  return (
    <section id="projectexperiences" className="py-16 md:py-24 px-6 md:px-12">
      <div className="container mx-auto">
        <p className="text-sm text-muted-foreground mb-1 font-body">Project & Experience</p>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-12">
          Experience since 2020 - Present
        </h2>

        {/* Timeline */}
        <div className="relative flex items-start gap-0 overflow-x-auto pb-4">
          {/* Line */}
          <div className="absolute top-4 left-0 right-0 h-px bg-border" />

          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              className="relative flex-shrink-0 w-64 pr-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
            >
              {/* Dot */}
              <div className="w-3 h-3 rounded-full bg-primary border-2 border-primary mb-6 relative z-10" />
              <h3 className="font-heading font-semibold text-foreground text-sm mb-1">{exp.company}</h3>
              <p className="text-xs text-muted-foreground font-body">{exp.role}</p>
              <p className="text-xs text-muted-foreground font-body">{exp.period}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceTimeline;
