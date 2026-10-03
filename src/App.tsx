import React, { useState, useEffect } from "react";
import LoadingScreen from "./components/LoadingScreen";
import StaggeredMenu, { type StaggeredMenuItem } from "./components/StaggeredMenu";
import HeroSection from "./components/HeroSection";
import BioSection from "./components/BioSection";
import SkillsSection from "./components/SkillsSection";
import ProjectsSection from "./components/ProjectsSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import { motion, AnimatePresence } from "motion/react";
import Beams from "./components/Beams";
import homeMenuImage from "../assets/ovchar.png";
import aboutMenuImage from "../assets/pic3.jpg";
import skillsMenuImage from "../assets/Firefly_Gemini Flash_remove the person statue here 336738.png";
import projectsMenuImage from "../assets/bg-im2.png";
import contactMenuImage from "../assets/bg-im3.png";

const navigationItems: StaggeredMenuItem[] = [
  { label: "Home", ariaLabel: "Go to home", link: "#hero", image: homeMenuImage },
  { label: "About", ariaLabel: "Read about Dibyajyoti", link: "#bio", image: aboutMenuImage },
  { label: "Skills", ariaLabel: "View skills and expertise", link: "#skills", image: skillsMenuImage },
  { label: "Projects", ariaLabel: "Browse selected projects", link: "#projects", image: projectsMenuImage },
  { label: "Contact", ariaLabel: "Go to contact section", link: "#contact", image: contactMenuImage },
];

const socialItems = [
  { label: "GitHub", link: "https://github.com/AAB-I-XES" },
  { label: "Email", link: "mailto:rabhadibyajyoti05@gmail.com" },
];

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isExitingLoader, setIsExitingLoader] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Scroll to targeted element with custom smooth offset handling
  const handleScrollToSection = (targetId: string) => {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };
  const handleScrollToNext = () => {
    handleScrollToSection("bio");
  };

  // Scroll back to the very top (Hero)
  const handleScrollToTop = () => {
    handleScrollToSection("hero");
  };

  // Prevent scrolling during active initial loading sequence or open menu state
  useEffect(() => {
    if (isLoading || isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLoading, isMenuOpen]);

  return (
    <div className="relative min-h-screen overflow-hidden select-none">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="animated-gradient-background absolute inset-0" />
      </div>
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <Beams
          beamWidth={3.5}
          beamHeight={18}
          beamNumber={8}
          lightColor="#ffffff"
          beamColor="#000000"
          backgroundColor="#000000"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={18}
        />
      </div>

      {/* 1. Loading Preloader Screen */}
      <LoadingScreen 
        onComplete={() => setIsLoading(false)} 
        onExitStart={() => setIsExitingLoader(true)}
      />

      {/* 2. Main Site Contents (Revealed after loading completes) */}
      <AnimatePresence>
        {(isExitingLoader || !isLoading) && (
          <>
            {/* Navigation Header & Fullscreen Menu (positioned at z-50 to be 100% visible and interactive) */}
            <StaggeredMenu
              position="right"
              items={navigationItems}
              socialItems={socialItems}
              displaySocials
              displayItemNumbering
              isFixed
              closeOnClickAway
              colors={["#3a3a3a", "#1d1d1d", "#080808"]}
              menuButtonColor="#ffffff"
              openMenuButtonColor="#ffffff"
              accentColor="#d7d7d7"
              onMenuOpen={() => setIsMenuOpen(true)}
              onMenuClose={() => setIsMenuOpen(false)}
              onItemSelect={(item) => handleScrollToSection(item.link.replace(/^#/, ""))}
            />

            {/* The Main Webpage Canvas */}
            <motion.div
              initial={{ opacity: 0, scale: 1.06, y: 30, filter: "blur(12px)" }}
              animate={{
                opacity: 1,
                scale: isMenuOpen ? 0.94 : 1,
                y: isMenuOpen ? 24 : 0,
                filter: "blur(0px)",
                borderRadius: isMenuOpen ? "28px" : "0px",
              }}
              transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative min-h-screen text-[#141414] overflow-x-hidden shadow-2xl pointer-events-auto origin-center"
              style={{ backgroundColor: "rgba(245,242,237,0.24)" }}
            >
              {/* If menu is open, render a clean interceptor overlay to safely snap back on click with soft shadow */}
              {isMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="absolute inset-0 z-50 cursor-pointer pointer-events-auto bg-[#0a0a0a]"
                />
              )}

              {/* Chapter I: The Genesis */}
              <HeroSection onScrollToNext={handleScrollToNext} />

              {/* Chapter II: The Creative Self */}
              <BioSection />

              {/* Chapter III: Craft & Sorcery */}
              <SkillsSection />

              {/* Chapter IV: The Gallery of Works */}
              <ProjectsSection />

              {/* Chapter V: Let's Build Together */}
              <ContactSection />

              {/* Footer with quick utilities */}
              <Footer onScrollToTop={handleScrollToTop} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
