import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MarqueeBanner from "@/components/MarqueeBanner";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import ProjectsGrid from "@/components/ProjectsGrid";
import SkillsSection from "@/components/SkillsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      <Header />
      <HeroSection />
      <div className="relative z-10 bg-crust">
        <MarqueeBanner />
        <ExperienceTimeline />
        <ProjectsGrid />
        <MarqueeBanner />
        <SkillsSection />
        <Footer />
      </div>
    </SmoothScroll>
  );
}
