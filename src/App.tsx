import React, { useState, useEffect } from "react";
import LoadingScreen from "./components/LoadingScreen";
import StaggeredMenu, { type StaggeredMenuItem } from "./components/StaggeredMenu";
import HeroSection from "./components/HeroSection";
import BioSection from "./components/BioSection";
import SkillsSection from "./components/SkillsSection";
import ProjectsSection from "./components/ProjectsSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Beams from "./components/Beams";
import aboutMenuImage from "../assets/pic3.jpg";
import skillsMenuImage from "../assets/Firefly_Gemini Flash_remove the person statue here 336738.png";
import projectsMenuImage from "../assets/bg-im2.png";
import contactMenuImage from "../assets/bg-im3.png";

const navigationItems: StaggeredMenuItem[] = [
  { label: "Home", ariaLabel: "Go to home", link: "#hero" },
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
  const prefersReducedMotion = useReducedMotion();
  const [isLoading, setIsLoading] = useState(true);
  const [isExitingLoader, setIsExitingLoader] = useState(false);
  const [isBeamTransitionActive, setIsBeamTransitionActive] = useState(false);
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
  const handleMenuItemSelect = (item: StaggeredMenuItem) => {
    handleScrollToSection(item.link.replace(/^#/, ""));
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
    <div className="relative min-h-screen overflow-hidden select-none bg-[#ededed]">

      {/* 1. Loading Preloader Screen */}
      <LoadingScreen 
        onComplete={() => setIsLoading(false)} 
        onExitStart={() => {
          setIsExitingLoader(true);
          setIsBeamTransitionActive(!prefersReducedMotion);
        }}
      />

      <AnimatePresence>
        {isBeamTransitionActive && (
          <motion.div
            initial={{
              clipPath: "circle(0% at 50% 50%)",
              opacity: 0,
              filter: "blur(12px)",
            }}
            animate={{
              clipPath: [
                "circle(0% at 50% 50%)",
                "circle(85% at 50% 50%)",
                "circle(150% at 50% 50%)",
              ],
              opacity: [0, 0.9, 0],
              filter: ["blur(12px)", "blur(0px)", "blur(8px)"],
            }}
            transition={{
              duration: 1.8,
              times: [0, 0.32, 1],
              ease: [0.16, 1, 0.3, 1],
            }}
            onAnimationComplete={() => setIsBeamTransitionActive(false)}
            className="pointer-events-none fixed inset-0 z-[145]"
            aria-hidden="true"
          >
            <Beams
              beamWidth={3.5}
              beamHeight={18}
              beamNumber={8}
              lightColor="#ffffff"
              beamColor="#141414"
              backgroundColor={null}
              speed={2}
              noiseIntensity={1.5}
              scale={0.18}
              rotation={18}
            />
          </motion.div>
        )}
      </AnimatePresence>

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
              onItemSelect={handleMenuItemSelect}
            />

            {/* The Main Webpage Canvas */}
            <motion.div
              initial={prefersReducedMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    scale: 1.035,
                    y: 24,
                    filter: "blur(14px)",
                    clipPath: "inset(48% 0 48% round 24px)",
                  }}
              animate={{
                opacity: 1,
                scale: isMenuOpen ? 0.94 : 1,
                y: isMenuOpen ? 24 : 0,
                filter: "blur(0px)",
                borderRadius: isMenuOpen ? "28px" : "0px",
                clipPath: "inset(0% 0% 0% round 0px)",
              }}
              transition={{ duration: prefersReducedMotion ? 0.2 : 1.65, ease: [0.16, 1, 0.3, 1] }}
              className="relative min-h-screen overflow-x-hidden shadow-2xl pointer-events-auto origin-center text-[#141414]"
              style={{ backgroundColor: "#ededed" }}
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

              <HeroSection onScrollToNext={handleScrollToNext} />
              <BioSection />
              <SkillsSection />
              <ProjectsSection />
              <ContactSection />
              <Footer onScrollToTop={handleScrollToTop} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
