import dynamic from "next/dynamic";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MarqueeBanner from "@/components/MarqueeBanner";

// Below-fold: code-split
const ExperienceTimeline = dynamic(() => import("@/components/ExperienceTimeline"), {
  ssr: true,
  loading: () => <div style={{ minHeight: "400px" }} />,
});
const ProjectsGrid = dynamic(() => import("@/components/ProjectsGrid"), {
  ssr: true,
  loading: () => <div style={{ minHeight: "800px" }} />,
});
const MarqueeBannerDynamic = dynamic(() => import("@/components/MarqueeBanner"), {
  ssr: true,
  loading: () => <div style={{ minHeight: "64px" }} />,
});
const SkillsSection = dynamic(() => import("@/components/SkillsSection"), {
  ssr: true,
  loading: () => <div style={{ minHeight: "500px" }} />,
});


export default function Home() {
  return (
    <>
      <HeroSection />
      <div className="relative z-10">
        <MarqueeBanner />
        <ExperienceTimeline />
        <ProjectsGrid />
        <MarqueeBannerDynamic />
        <SkillsSection />
      </div>
    </>
  );
}
