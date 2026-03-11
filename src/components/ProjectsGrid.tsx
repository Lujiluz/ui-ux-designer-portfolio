"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

// ─── Interfaces & Data ───────────────────────────────────────────────────────

interface Project {
  title: string;
  category: string;
  date: string;
  type: string;
  image: string;
  client: string;
  creator: string;
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
        title: "MASATA PROJECT",
        category: "MOBILE",
        date: "2021",
        type: "Web design & development",
        image: "/images/projectsAndExperience/masata.png",
        client: "TELKOM INDONESIA",
        creator: "RIMA ZAKIYATIN",
      },
      {
        title: "JALAN KITA 2.0",
        category: "WEB & MOBILE",
        date: "2021",
        type: "Mobile app design",
        image: "/images/projectsAndExperience/jalan_kita.png",
        client: "KEMENTRIAN PUPR",
        creator: "RIMA ZAKIYATIN",
      },
      {
        title: "MY ARCHERY",
        category: "MOBILE",
        date: "2022",
        type: "Mobile app design",
        image: "/images/projectsAndExperience/my_archery.png",
        client: "ARCHERY INC",
        creator: "RIMA ZAKIYATIN",
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
        title: "ADA POLISI",
        category: "MOBILE",
        date: "2022",
        type: "Mobile app design",
        image: "/images/projectsAndExperience/ada_polisi.png",
        client: "POLRI",
        creator: "RIMA ZAKIYATIN",
      },
      {
        title: "FORUM TJSL",
        category: "WEB & MOBILE",
        date: "2022",
        type: "Web design & development",
        image: "/images/projectsAndExperience/forum_tjsl.png",
        client: "KEMENTRIAN BUMN",
        creator: "RIMA ZAKIYATIN",
      },
      {
        title: "PONGA FOOD",
        category: "MOBILE",
        date: "2023",
        type: "Mobile app design",
        image: "/images/projectsAndExperience/ponga_food_store.png",
        client: "PONGA INC",
        creator: "RIMA ZAKIYATIN",
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

function ProjectCard({ project, index, company }: { project: Project; index: number; company: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring dibikin sedikit lebih responsif biar ngejarnya enak
  const glowX = useSpring(mouseX, { stiffness: 120, damping: 20, mass: 0.8 });
  const glowY = useSpring(mouseY, { stiffness: 120, damping: 20, mass: 0.8 });

  // 1. Setup awal: taruh posisi senter di pojok kanan bawah
  useEffect(() => {
    setIsMounted(true);
    if (cardRef.current) {
      mouseX.set(cardRef.current.offsetWidth);
      mouseY.set(cardRef.current.offsetHeight);
    }
  }, [mouseX, mouseY]);

  // 2. Waktu kursor gerak di dalam card, senter ngikutin kursor
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  // 3. Waktu kursor keluar, senter pulang ke pojok kanan bawah
  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    mouseX.set(cardRef.current.offsetWidth);
    mouseY.set(cardRef.current.offsetHeight);
  };

  return (
    <motion.div
      ref={cardRef}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative overflow-hidden rounded-[20px] bg-[#1a1c18] border border-white/5 cursor-pointer flex flex-col p-6 md:p-8 min-h-85 group"
    >
      {/* Senter Tunggal - Akan pindah-pindah berdasarkan spring state */}
      <motion.div
        className="absolute w-80 h-80 bg-primary/25 blur-[90px] rounded-full pointer-events-none z-0"
        style={{
          x: glowX,
          y: glowY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isMounted ? 1 : 0, // Mencegah kedip pas baru pertama render
        }}
        transition={{ opacity: { duration: 0.5 } }}
      />

      {/* Background Grid Pattern + Radial Mask */}
      <div
        className="absolute inset-0 opacity-[0.25] pointer-events-none z-0"
        style={{
          backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(circle at 20% 65%, black 10%, transparent 40%)",
          WebkitMaskImage: "radial-gradient(circle at 20% 65%, black 10%, transparent 40%)",
        }}
      />

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none z-0" style={{ backgroundImage: `url("/images/noice.svg")` }} />

      {/* Card Content */}
      <div className="relative z-10 flex flex-col h-full pointer-events-auto">
        <div className="flex items-center gap-4 mb-10">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ x: 2, y: 2, boxShadow: "0px 0px 0px rgba(0,0,0,1)" }}
            className="px-5 py-1.5 text-xs font-bold bg-primary text-black rounded-lg border border-black shadow-[3px_3px_0px_rgba(85,85,85,1)] tracking-wide transition-shadow"
          >
            DONE
          </motion.button>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ x: 2, y: 2, boxShadow: "0px 0px 0px rgba(0,0,0,1)" }}
            className="px-5 py-1.5 text-xs font-bold bg-[#e8f3a3] text-black rounded-lg border border-black shadow-[3px_3px_0px_rgba(85,85,85,1)] tracking-wide transition-shadow"
          >
            {project.category}
          </motion.button>
        </div>

        <div className="mt-auto mb-10 pointer-events-none">
          <p className="text-sm text-muted-foreground font-body mb-2">{company}</p>
          <h3 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-1 tracking-tight">{project.title}</h3>
          <p className="text-3xl md:text-4xl font-heading font-bold text-foreground tracking-tight">{project.date}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 pointer-events-none">
          <div>
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase mb-1.5">Client</p>
            <p className="text-sm font-semibold tracking-wide text-foreground/90">{project.client}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase mb-1.5">Creator</p>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 relative rounded-full overflow-hidden bg-primary/20 shrink-0 border border-primary/30">
                <Image src="/images/3d_avatar.svg" alt="Creator" fill className="object-cover" />
              </div>
              <p className="text-sm font-semibold tracking-wide text-foreground/90">{project.creator}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── CTACard ─────────────────────────────────────────────────────────────────

function CTACard({ index }: { index: number }) {
  const [isActive, setIsActive] = useState(false);

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      onHoverStart={() => setIsActive(true)}
      onHoverEnd={() => setIsActive(false)}
      onClick={() => setIsActive((prev) => !prev)}
      className="relative overflow-hidden rounded-[20px] bg-[#1a1c18] border border-white/5 cursor-pointer flex flex-col justify-center p-8 min-h-85 group"
    >
      {/* Grid Pattern & Noise biar seragam */}
      <div
        className="absolute inset-0 opacity-[0.25] pointer-events-none z-0"
        style={{
          backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(circle at 20% 65%, black 10%, transparent 40%)",
          WebkitMaskImage: "radial-gradient(circle at 20% 65%, black 10%, transparent 40%)",
        }}
      />
      <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none z-0" style={{ backgroundImage: `url("/images/noice.svg")` }} />

      {/* Diamond Shape - Dibuat lebih besar & animasi lebih lambat */}
      <motion.div
        className="absolute top-7.5 right-7.5 z-0 text-primary pointer-events-none origin-center"
        animate={{
          scale: isActive ? 20 : 1,
          rotate: isActive ? 75 : 0,
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} // Durasi ditambah dari 0.6 ke 0.9
      >
        {/* <svg width="140" height="140" viewBox="0 0 100 100" fill="currentColor">
          <path d="m 50 -16 C 50 35 65 50 111 51 C 65 50 50 65 50 132 C 50 65 35 50 -13 50 C 35 50 50 35 50 -16 Z" />
        </svg>
         */}
        <svg xmlns="http://www.w3.org/2000/svg" width="124" height="148" viewBox="-13 -16 124 148" fill="currentColor">
          <path d="m 50 -16 C 50 35 65 50 111 51 C 65 50 50 65 50 132 C 50 65 35 50 -13 50 C 35 50 50 35 50 -16 Z" />
        </svg>
      </motion.div>

      {/* Card Content */}
      <div className="relative z-10 flex flex-col items-start mt-auto pointer-events-none">
        <h3 className={`text-2xl md:text-3xl font-heading font-bold mb-6 transition-colors duration-500 ease-in-out ${isActive ? "text-[#121212]" : "text-foreground"}`}>View another projects</h3>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ease-in-out ${isActive ? "border-[#121212] text-[#121212]" : "border-white/20 text-foreground"}`}>
          <ArrowRight className={`w-5 h-5 transition-transform duration-500 ${isActive ? "translate-x-1" : ""}`} />
        </div>
      </div>
    </motion.div>
  );
}

// ─── LogoBar ─────────────────────────────────────────────────────────────────

function LogoBar({ logos }: { logos: { label: string; year: string }[] }) {
  return (
    <motion.div variants={logoContainerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex items-center gap-4 mb-10 overflow-x-auto pb-4 scrollbar-hide">
      {logos.map((logo, i) => (
        <motion.div key={i} variants={logoItemVariants} whileHover={{ scale: 1.05 }} className="flex items-center gap-2 shrink-0 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 cursor-pointer backdrop-blur-sm">
          <span className="text-sm font-heading font-semibold text-foreground tracking-wide">{logo.label}</span>
          <span className="text-xs text-muted-foreground font-body">{logo.year}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── ProjectsGrid (default export) ───────────────────────────────────────────

const ProjectsGrid = () => {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-[#121212]">
      <div className="container mx-auto space-y-32">
        {projectSets.map((set, si) => (
          <div key={si}>
            {/* Section header */}
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2 font-body">Project & Experience</p>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">{set.company}</h2>
            <p className="text-sm md:text-base font-heading font-semibold text-primary mb-6">{set.role}</p>
            <p className="text-sm md:text-base text-muted-foreground font-body max-w-3xl mb-12 leading-relaxed">{set.description}</p>

            {/* Logo bar */}
            <LogoBar logos={set.logos} />

            {/* Bento grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProjectCard project={set.projects[0]} index={0} company={set.company.replace("'s Project", "")} />
              <ProjectCard project={set.projects[1]} index={1} company={set.company.replace("'s Project", "")} />
              <ProjectCard project={set.projects[2]} index={2} company={set.company.replace("'s Project", "")} />
              <CTACard index={3} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsGrid;
