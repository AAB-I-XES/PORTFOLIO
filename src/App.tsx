import React, { useState, useEffect } from "react";
import LoadingScreen from "./components/LoadingScreen";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import BioSection from "./components/BioSection";
import SkillsSection from "./components/SkillsSection";
import ProjectsSection from "./components/ProjectsSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import { motion, AnimatePresence } from "motion/react";

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

  // Scroll to next chronological story section (from Hero to Bio)
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
    <div className="relative min-h-screen bg-[#111111] overflow-hidden select-none">
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
            <Header 
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              onNavClick={handleScrollToSection} 
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
              className="relative min-h-screen bg-[#f5f2ed] text-[#141414] overflow-x-hidden shadow-2xl pointer-events-auto origin-center"
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
