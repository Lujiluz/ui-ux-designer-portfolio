"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// ─── Interfaces & Data ───────────────────────────────────────────────────────

interface Project {
  slug?: string;
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
  // Di-update: sekarang logo nerima src untuk nampilin gambar
  logos: { src: string; alt: string; year: string }[];
}

const projectSets: ProjectSet[] = [
  {
    company: "Reka Cipta Digital's Project",
    role: "UI/UX Designer (2021-2023)",
    description:
      "The following section presents a comprehensive overview of the projects I worked on between 2021 and 2023, highlighting the scope of each project, my roles and responsibilities, the design and development processes involved, and the outcomes achieved throughout this period.",
    logos: [
      { src: "/images/projectsAndExperience/masata.png", alt: "MASATA", year: "2021" },
      { src: "/images/projectsAndExperience/jalan_kita.png", alt: "Jalan Kita 2.0", year: "2021" },
      { src: "/images/projectsAndExperience/my_archery.png", alt: "My Archery", year: "2022" },
      { src: "/images/projectsAndExperience/ada_polisi.png", alt: "Ada Polisi", year: "2022" },
      { src: "/images/projectsAndExperience/forum_tjsl.png", alt: "Forum TJSL", year: "2022" },
      { src: "/images/projectsAndExperience/ponga_food_store.png", alt: "Ponga Food Store", year: "2023" },
    ],
    projects: [
      {
        slug: "masata-project",
        title: "MASATA PROJECT",
        category: "MOBILE",
        date: "2021",
        type: "Web design & development",
        image: "/images/projectsAndExperience/masata.png",
        client: "TELKOM INDONESIA",
        creator: "RIMA ZAKIYATIN",
      },
      {
        slug: "jalan-kita-project",
        title: "JALAN KITA 2.0",
        category: "WEB & MOBILE",
        date: "2021",
        type: "Mobile app design",
        image: "/images/projectsAndExperience/jalan_kita.png",
        client: "KEMENTRIAN PUPR",
        creator: "RIMA ZAKIYATIN",
      },
      {
        slug: "my-archery-project",
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, staggerChildren: 0.1 },
  },
};

const logoItemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

// ─── ProjectCard & CTACard ─────────────────────────

function ProjectCard({ project, index, company }: { project: Project; index: number; company: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useSpring(mouseX, { stiffness: 120, damping: 20, mass: 0.8 });
  const glowY = useSpring(mouseY, { stiffness: 120, damping: 20, mass: 0.8 });

  useEffect(() => {
    setIsMounted(true);
    if (cardRef.current) {
      mouseX.set(cardRef.current.offsetWidth);
      mouseY.set(cardRef.current.offsetHeight);
    }
  }, [mouseX, mouseY]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    mouseX.set(cardRef.current.offsetWidth);
    mouseY.set(cardRef.current.offsetHeight);
  };

  return (
    <Link href={`/projects/${project.slug}`} className="block h-full outline-none group">
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
        <motion.div
          className="absolute w-80 h-80 bg-primary/25 blur-[90px] rounded-full pointer-events-none z-0"
          style={{ x: glowX, y: glowY, translateX: "-50%", translateY: "-50%", opacity: isMounted ? 1 : 0 }}
          transition={{ opacity: { duration: 0.5 } }}
        />
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

        <div className="relative z-10 flex flex-col h-full pointer-events-auto">
          <div className="flex items-center gap-4 mb-10">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ x: 2, y: 2, boxShadow: "0px 0px 0px rgba(0,0,0,1)" }}
              className="px-5 py-1.5 text-xs font-bold bg-primary text-black rounded-lg border border-black shadow-[3px_3px_0px_rgba(85,85,85,1)] tracking-wide transition-shadow cursor-pointer"
            >
              DONE
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ x: 2, y: 2, boxShadow: "0px 0px 0px rgba(0,0,0,1)" }}
              className="px-5 py-1.5 text-xs font-bold bg-[#e8f3a3] text-black rounded-lg border border-black shadow-[3px_3px_0px_rgba(85,85,85,1)] tracking-wide transition-shadow cursor-pointer"
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
    </Link>
  );
}

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

      <motion.div className="absolute top-7.5 right-7.5 z-0 text-primary pointer-events-none origin-center" animate={{ scale: isActive ? 35 : 1, rotate: isActive ? 90 : 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
        <svg width="140" height="140" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 0 C50 40, 60 50, 80 50 C60 50, 50 60, 50 100 C50 60, 40 50, 20 50 C40 50, 50 40, 50 0 Z" />
        </svg>
      </motion.div>

      <div className="relative z-10 flex flex-col items-start mt-auto pointer-events-none">
        <h3 className={`text-2xl md:text-3xl font-heading font-bold mb-6 transition-colors duration-500 ease-in-out ${isActive ? "text-[#121212]" : "text-foreground"}`}>View another projects</h3>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ease-in-out ${isActive ? "border-[#121212] text-[#121212]" : "border-white/20 text-foreground"}`}>
          <ArrowRight className={`w-5 h-5 transition-transform duration-500 ${isActive ? "translate-x-1" : ""}`} />
        </div>
      </div>
    </motion.div>
  );
}

// ─── LogoBar berubah jadi Display Image ───────────────────────────

function LogoBar({ logos }: { logos: { src: string; alt: string; year: string }[] }) {
  return (
    <motion.div
      variants={logoContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      // Container gelap dengan rounded besar sesuai desain
      className="w-full bg-[#1a1c18] border border-white/5 rounded-3xl p-8 md:p-10 mb-16 flex items-center justify-start md:justify-around gap-8 overflow-x-auto scrollbar-hide"
    >
      {logos.map((logo, i) => (
        <motion.div key={i} variants={logoItemVariants} className="flex flex-col items-center gap-4 shrink-0 min-w-25">
          {/* Logo Image Placeholder - atur tinggi/lebar sesuai proporsi logo aslinya */}
          <div className="relative h-10 w-24 md:h-12 md:w-28 flex items-center justify-center">
            {/* Kalau belum ada file gambarnya, pasangin text alt dulu sementara gapapa. Nanti ganti Image tag-nya */}
            <Image
              src={logo.src}
              alt={logo.alt}
              fill
              className="object-contain filter brightness-0 invert opacity-90" // Trik bikin logo jadi putih kalau aslinya hitam
            />
          </div>
          <span className="text-base md:text-lg font-heading font-bold text-foreground">{logo.year}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── DI-UPDATE: ProjectsGrid Header ──────────────────────────────────────────

const ProjectsGrid = () => {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-[#121212]">
      <div className="container mx-auto space-y-32">
        {projectSets.map((set, si) => (
          <div key={si}>
            {/* Header Baru */}
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-3">{set.company}</h2>
            <p className="text-lg md:text-xl font-heading font-bold text-foreground mb-6">{set.role}</p>
            <p className="text-sm md:text-base text-muted-foreground font-body max-w-4xl mb-10 leading-relaxed">{set.description}</p>

            {/* Logo Container Baru */}
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
