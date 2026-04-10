import Image from "next/image";
import { User, Clock, Briefcase } from "lucide-react";

// Tipe data buat halaman detail
interface ProjectDetail {
  title: string;
  role: string;
  duration: string;
  client: string;
  overview: string;
  responsibilities: string;
  execution: string;
  timelineIntro: string;
  timeline: { title: string; desc: string }[];
  image: string;
}

// Dummy data nge-mock detail MASATA
const projectData: Record<string, ProjectDetail> = {
  "masata-project": {
    title: "Masyarakat Sadar Wisata (MASATA).",
    role: "UX/UI designer",
    duration: "2 months",
    client: "Telkom Indonesia",
    overview:
      "MASATA (Tourism Awareness Society) is a digital application aimed at enhancing public awareness and participation in the development of the tourism sector. This application provides various informative and transactional features such as the latest news related to tourism, donations to support activities and the development of tourist destinations, information on tourism events, as well as PPOB services to facilitate various payment needs of the community within a single integrated platform.",
    responsibilities: "UX Research, user flow & information architecture, UI/UX design, visual design, design system creation, stakeholder collaboration, documentation.",
    execution:
      "The project execution process begins with conducting a design analysis from the client side, followed by redesigning according to the points identified in the Heuristic Evaluation (HE). The Heuristic Evaluation (HE) includes priority scale points to determine the design work. Once the redesign meets the points of the Heuristic Evaluation (HE), the process will proceed to development with the final design that has been created. This project runs and concludes within the timeline proposed by the client.",
    timelineIntro:
      "A well-defined process is the foundation of impactful design. Every decision in this project is guided by clarity, usability principles, and measurable objectives.\n\nRather than focusing solely on visual improvements, this approach prioritizes identifying core usability challenges, analyzing user interaction patterns, and transforming insights into actionable design solutions.\n\nThe project timeline illustrates a structured journey — from in-depth evaluation and interface refinement to collaborative development and final validation. Each stage ensures that the outcome is not only aesthetically advanced, but also strategically aligned with user needs and business goals.\n\nThrough systematic thinking and continuous iteration, usability insights are translated into refined user experiences, optimized workflows, and development-ready solutions that are practical, scalable, and ready for end-to-end implementation.",
    timeline: [
      {
        title: "Analysis of HE documents",
        desc: "Read all results of the Heuristic Evaluation (HE) documents\nDetermine the priority scale for issues to be solved",
      },
      {
        title: "Redesign User Interface",
        desc: "Redesign the user interface according to the HE results",
      },
      {
        title: "Handoff the design results to the development team",
        desc: "Deliver the redesign results to the developer team for the development process",
      },
      {
        title: "Monitor development progress",
        desc: "Check the design output that was created in the development stage",
      },
      {
        title: "Finalize the project",
        desc: "Ensure all features function normally without any bugs\nEnsure the redesign results align with the initial vision",
      },
    ],
    image: "/images/projectsAndExperience/detail/masata.png",
  },
};

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const project = projectData[slug];

  if (!project) {
    return <div className="min-h-screen flex items-center justify-center">Project not found</div>;
  }

  return (
    <div className="pt-38 pb-20 px-6 md:px-12 bg-[#121212] min-h-screen">
      <div className="container mx-auto max-w-5xl">
        {/* Breadcrumb / Kategori */}
        <p className="text-sm text-muted-foreground mb-4">Projects & Experiences</p>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-12">{project.title}</h1>

        {/* Info Row (Role, Duration, Client) */}
        <div className="flex flex-wrap gap-8 md:gap-16 mb-16">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#1a1c18] border border-white/5 rounded-xl">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-1">Role</p>
              <p className="text-sm font-semibold">{project.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#1a1c18] border border-white/5 rounded-xl">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-1">Duration</p>
              <p className="text-sm font-semibold">{project.duration}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#1a1c18] border border-white/5 rounded-xl">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-1">Client</p>
              <p className="text-sm font-semibold">{project.client}</p>
            </div>
          </div>
        </div>

        {/* Overview, Responsibilities, Execution Sections */}
        <div className="space-y-10 mb-20">
          <section>
            <h2 className="text-xl font-heading font-bold mb-4 text-white">Overview</h2>
            <p className="text-muted-foreground text-sm leading-relaxed text-justify">{project.overview}</p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold mb-4 text-white">Responsibilities</h2>
            <p className="text-muted-foreground text-sm leading-relaxed text-justify">{project.responsibilities}</p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-bold mb-4 text-white">Project Execution</h2>
            <p className="text-muted-foreground text-sm leading-relaxed text-justify">{project.execution}</p>
          </section>
        </div>

        {/* Project Timeline Section */}
        <div className="mb-20">
          <h2 className="text-2xl font-heading font-bold text-primary mb-6">Project Timeline</h2>
          <h3 className="text-lg font-bold text-white mb-4">Structured. Strategic. Solution-Driven.</h3>

          <div className="text-muted-foreground text-sm leading-relaxed space-y-4 mb-12 whitespace-pre-line text-justify">{project.timelineIntro}</div>

          {/* Timeline UI Component */}
          <div className="relative pl-6 md:pl-8 border-l border-white/10 space-y-8">
            {project.timeline.map((item, idx) => (
              <div key={idx} className="relative">
                {/* Timeline Dot (Bulatan hijau) */}
                <div className="absolute -left-7.5 md:-left-9.5 top-1 w-4 h-4 rounded-full bg-primary ring-4 ring-[#121212]" />

                <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
                <p className="text-muted-foreground text-sm whitespace-pre-line leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mockups / Images Grid */}
        <div className="w-full rounded-[20px] md:rounded-[40px] overflow-hidden border border-white/10 bg-[#1a1c18] shadow-2xl">
          <Image src={project.image} alt={`${project.title} Showcase`} width={1920} height={1080} className="w-full h-auto object-cover" priority />
        </div>
      </div>
    </div>
  );
}
