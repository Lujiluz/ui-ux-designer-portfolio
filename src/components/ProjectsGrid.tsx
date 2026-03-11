"use client";

import { useRef, useState } from "react";
import { motion, LayoutGroup, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

// ─── Interfaces & Data ───────────────────────────────────────────────────────

interface Project {
  title: string;
  category: string;
  date: string;
  type: string;
  image: string;
}

interface ProjectSet {
  company: string;
  role: string;
  description: string;
  projects: Project[];
  logos: { label: string; year: string }[];
}

const projectSets: ProjectSet[] = [
  {
    company: "Reka Cipta Digital's Project",
    role: "UI/UX Designer (2021-2024)",
    description:
      "The following section presents a comprehensive overview of the projects I worked on between 2021 and 2024, highlighting the scope of each project, my roles and responsibilities, the design and development processes involved, and the outcomes achieved throughout this period.",
    logos: [
      { label: "MASATA", year: "2021" },
      { label: "Jalan Kita", year: "2021" },
      { label: "My Archery", year: "2022" },
    ],
    projects: [
      {
        title: "MASATA",
        category: "Web Design",
        date: "2021",
        type: "Web design & development",
        image: "/images/projectsAndExperience/masata.png",
      },
      {
        title: "Jalan Kita",
        category: "Mobile App",
        date: "2021",
        type: "Mobile app design",
        image: "/images/projectsAndExperience/jalan_kita.png",
      },
      {
        title: "My Archery",
        category: "Mobile App",
        date: "2022",
        type: "Mobile app design",
        image: "/images/projectsAndExperience/my_archery.png",
      },
    ],
  },
  {
    company: "PT Kreasindo Karya Abadi's Project",
    role: "UI/UX Designer (2024-Present)",
    description:
      "The following section presents a comprehensive overview of the projects I worked on between 2024 and 2025, highlighting the scope of each project, my roles and responsibilities, the design and development processes involved, and the outcomes achieved throughout this period.",
    logos: [
      { label: "Ada Polisi", year: "2022" },
      { label: "Forum TJSL", year: "2022" },
      { label: "Ponga Food", year: "2023" },
    ],
    projects: [
      {
        title: "Ada Polisi",
        category: "Mobile App",
        date: "2022",
        type: "Mobile app design",
        image: "/images/projectsAndExperience/ada_polisi.png",
      },
      {
        title: "Forum TJSL",
        category: "Web Design",
        date: "2022",
        type: "Web design & development",
        image: "/images/projectsAndExperience/forum_tjsl.png",
      },
      {
        title: "Ponga Food Store",
        category: "Mobile App",
        date: "2023",
        type: "Mobile app design",
        image: "/images/projectsAndExperience/ponga_food_store.png",
      },
    ],
  },
];

// ─── Animation Variants ───────────────────────────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const logoContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const logoItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ─── ProjectCard ─────────────────────────────────────────────────────────────

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.0, 0.95]);

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={{ scale: 1.015, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="card-border-glow group relative overflow-hidden rounded-2xl border border-border bg-card cursor-pointer flex flex-col min-h-80 md:min-h-100"
    >
      {/* Text header */}
      <div className="p-5 flex flex-col gap-1 shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-body">{`{ ${project.category} }`}</span>
          <span className="text-xs text-muted-foreground font-body">{project.date}</span>
        </div>
        <h3 className="text-2xl font-heading font-bold text-foreground leading-tight">{project.title}</h3>
        <p className="text-sm text-muted-foreground font-body">{project.type}</p>
      </div>

      {/* Scroll-scaled image */}
      <div className="relative flex-1 overflow-hidden flex items-center justify-center p-4">
        <motion.div className="relative w-full h-full" style={{ scale }}>
          <Image src={project.image} alt={project.title} fill quality={100} className="object-contain" sizes="(max-width: 768px) 100vw, 50vw" />
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── CTACard ─────────────────────────────────────────────────────────────────

function CTACard({ index }: { index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card cursor-pointer flex items-center justify-center min-h-50 md:min-h-100 p-8"
    >
      {/* Expanding green background — starts as a small box, grows to fill on hover */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-140 h-85 rounded-2xl bg-primary transition-all duration-500 ease-in-out group-hover:w-full group-hover:h-full group-hover:rounded-none" />
      </div>

      {/* Content: text + arrow inline */}
      <LayoutGroup>
        <div className="relative z-10 flex items-center gap-2">
          {/* Text: slides vertically, width adjusts to current text */}
          <motion.div layout className="overflow-hidden h-7" transition={{ duration: 0.3, ease: "easeInOut" }}>
            {/* Invisible sizer — drives the container width to match current text */}
            <span className="invisible block h-0 text-lg font-heading font-bold whitespace-nowrap">
              {hovered ? "Another Projects" : "View more"}
            </span>
            {/* Visible sliding texts */}
            <div className={`transition-transform duration-300 ${hovered ? "-translate-y-7" : "translate-y-0"}`}>
              <p className="h-7 flex items-center text-lg font-heading font-bold text-secondary whitespace-nowrap">Another projects</p>
              <p className="h-7 flex items-center text-lg font-heading font-bold text-secondary whitespace-nowrap">Another Projects</p>
            </div>
          </motion.div>

          {/* Arrow — stays in place vertically, slides horizontally via layout animation */}
          <motion.div
            layout
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-12 h-12 rounded-full bg-secondary border-2 border-secondary/30 flex items-center justify-center group-hover:border-secondary/70 shrink-0"
          >
            <ArrowRight className="w-5 h-5 transition-transform duration-300 -rotate-45 group-hover:rotate-0" />
          </motion.div>
        </div>
      </LayoutGroup>
    </motion.div>
  );
}

// ─── LogoBar ─────────────────────────────────────────────────────────────────

function LogoBar({ logos }: { logos: { label: string; year: string }[] }) {
  return (
    <motion.div variants={logoContainerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex items-center gap-6 mb-8 overflow-x-auto pb-2">
      {logos.map((logo, i) => (
        <motion.div key={i} variants={logoItemVariants} whileHover={{ scale: 1.1 }} className="flex items-center gap-2 shrink-0 px-4 py-2 rounded-full border border-border bg-card cursor-pointer">
          <span className="text-sm font-heading font-semibold text-foreground">{logo.label}</span>
          <span className="text-xs text-muted-foreground font-body">{logo.year}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── ProjectsGrid (default export) ───────────────────────────────────────────

const ProjectsGrid = () => {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12">
      <div className="container mx-auto space-y-24">
        {projectSets.map((set, si) => (
          <div key={si}>
            {/* Section header */}
            <p className="text-sm text-muted-foreground mb-1 font-body">Project & Experience</p>
            <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-1">{set.company}</h2>
            <p className="text-sm font-heading font-semibold text-primary mb-4">{set.role}</p>
            <p className="text-sm text-muted-foreground font-body max-w-2xl mb-10">{set.description}</p>

            {/* Logo bar */}
            <LogoBar logos={set.logos} />

            {/* Bento grid: 2-column, top row = 2 equal cards, bottom row = 1 project + CTA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Top row: card 0 + card 1 */}
              <ProjectCard project={set.projects[0]} index={0} />
              <ProjectCard project={set.projects[1]} index={1} />

              {/* Bottom row: card 2 + CTA */}
              <ProjectCard project={set.projects[2]} index={2} />
              <CTACard index={3} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsGrid;
