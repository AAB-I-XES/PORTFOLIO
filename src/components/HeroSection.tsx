import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowDown, Compass, Cpu, Sparkles, Globe } from "lucide-react";
import { BIO_SUMMARY } from "../data";
import ovcharBg from "../../assets/ovchar.png";

interface HeroSectionProps {
  onScrollToNext: () => void;
}

export default function HeroSection({ onScrollToNext }: HeroSectionProps) {
  const [localTime, setLocalTime] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const overlayParallaxX = mousePos.x * 22;
  const overlayParallaxY = mousePos.y * 18;

  const handleContactClick = () => {
    const target = document.getElementById("contact");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Update Guwahati Local Time in real-time
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setLocalTime(new Intl.DateTimeFormat("en-US", options).format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Track mouse movement for subtle interactive tilt & parallax
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Normalize position between -0.5 and 0.5
    const x = (clientX / width) - 0.5;
    const y = (clientY / height) - 0.5;
    
    setMousePos({ x, y });
  };

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      style={{
        backgroundImage: `url(${ovcharBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
      className="min-h-screen w-full relative flex flex-col justify-between items-center p-6 md:p-12 overflow-hidden select-none"
    >
      {/* Full-bleed character overlay behind the content layer */}
      <div
        className="absolute inset-0 pointer-events-none z-0 hidden md:block"
        style={{
          backgroundImage: `url(${ovcharBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          transform: `translate3d(${overlayParallaxX}px, ${overlayParallaxY}px, 0) scale(1.06)`,
          transition: "transform 200ms ease-out",
          willChange: "transform"
        }}
      />

      {/* 1. ARCHITECTURAL DRAFTING PAPER BACKGROUND EFFECT */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.25]">
        {/* Drafting Grid */}
        <div className="absolute inset-0 sketch-grid" />
        
        {/* Architectural guidelines crossing the screen */}
        <div className="absolute top-[35%] left-0 w-full h-[1px] bg-[#141414]/10" />
        <div className="absolute top-[65%] left-0 w-full h-[1px] bg-[#141414]/10" />
        <div className="absolute left-[25%] top-0 w-[1px] h-full bg-[#141414]/10" />
        <div className="absolute left-[75%] top-0 w-[1px] h-full bg-[#141414]/10" />

        {/* Dynamic coordinate crosshairs following mouse with smooth delay */}
        <div 
          className="absolute w-8 h-8 border border-dashed border-[#141414]/15 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
          style={{
            left: `${(mousePos.x + 0.5) * 100}%`,
            top: `${(mousePos.y + 0.5) * 100}%`,
          }}
        >
          <div className="absolute inset-3 bg-[#ffd6e0]/60 rounded-full animate-ping" />
        </div>
      </div>

      {/* Decorative Blueprint Corner Brackets */}
      <div className="absolute inset-4 md:inset-8 border border-[#141414]/5 rounded-2xl pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#141414]/20 -translate-x-[1px] -translate-y-[1px]" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#141414]/20 translate-x-[1px] -translate-y-[1px]" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#141414]/20 -translate-x-[1px] translate-y-[1px]" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#141414]/20 translate-x-[1px] translate-y-[1px]" />
        
        {/* Minimal drafting labels in corners */}
        <span className="absolute top-2 left-3 font-mono text-[8px] text-[#141414]/30">DRAFT_SHEET_A_01</span>
        <span className="absolute top-2 right-3 font-mono text-[8px] text-[#141414]/30">2026_EDITION</span>
      </div>

      {/* Top spacing placeholder matching Header layout */}
      <div className="h-16 w-full relative z-10" />

      {/* Main Core Content Container */}
      <div className="relative w-full flex-1 flex flex-col justify-center items-center z-10 max-w-6xl px-4 sm:px-6">
        
        {/* A. CONTACT FOR INFO PILL BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <button
            type="button"
            onClick={handleContactClick}
            className="inline-flex items-center gap-2 rounded-full border border-[#141414]/10 bg-white/80 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.35em] text-[#141414] shadow-sm transition hover:bg-[#f5f2ed]"
          >
            Contact for Info
          </button>
        </motion.div>

        {/* B. HERO TYPOGRAPHY FRAME */}
        <div className="relative w-full flex flex-col items-center justify-center text-center">
          
          {/* Subtle elegant line above title */}
          <div className="w-24 h-[1px] bg-[#141414]/10 mb-4" />

          {/* BACKGROUND TEXT */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-[54px] sm:text-[100px] md:text-[160px] font-black text-[#141414]/2 select-none tracking-tighter uppercase pointer-events-none font-display">
            CREATOR
          </div>

          <motion.h2
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.42em" }}
            transition={{ duration: 1.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-[10px] md:text-xs tracking-[0.42em] uppercase text-[#141414]/50 mb-1 pl-1"
          >
            STUDIO OF DIBYAJYOTI RABHA
          </motion.h2>

          {/* The main typographic title */}
          <div className="relative flex flex-col items-center justify-center">
            <h1 className="font-display font-normal text-5xl sm:text-7xl md:text-[7rem] lg:text-[8.5rem] leading-[0.85] tracking-[0.05em] uppercase select-none text-[#e7d8c7] drop-shadow-[0_2px_10px_rgba(20,20,20,0.45)]">
              <motion.span
                initial={{ opacity: 0, y: 50, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                DIBYAJYOTI
              </motion.span>
              
              <motion.span
                initial={{ opacity: 0, y: 50, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                RABHA
              </motion.span>
            </h1>

          </div>

          {/* DRAFTING RULER DIVIDER Ticks */}
          <div className="w-full max-w-xl my-8 relative flex items-center justify-center">
            <div className="w-full h-[1px] bg-[#141414]/15" />
            
            {/* Procedure drafting ticks */}
            <div className="absolute inset-0 flex justify-between px-6 pointer-events-none opacity-40">
              {[...Array(11)].map((_, i) => (
                <div
                  key={i}
                  className={`bg-[#141414] w-[1px] ${
                    i === 5 ? "h-3 -translate-y-1" : i % 2 === 0 ? "h-2" : "h-1"
                  }`}
                />
              ))}
            </div>
            
            <div className="absolute bg-[#f5f2ed] px-4 font-mono text-[9px] uppercase tracking-widest text-[#141414]/40">
              TACTILE VECTOR ENGINE
            </div>
          </div>

          {/* Subtitle / Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-sm md:text-base text-[#141414]/75 max-w-lg leading-relaxed font-semibold px-4 select-text"
          >
            {BIO_SUMMARY.tagline}
          </motion.p>
        </div>

      </div>

      {/* Footer Navigation & System Status Row (BOTTOM) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.6, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex justify-between items-end relative z-10"
      >
        {/* Dynamic Location Indicator */}
        <div className="hidden md:flex flex-col gap-1 font-mono text-[9px] tracking-widest text-[#141414]/45 text-left uppercase">
          <div className="flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-[#141414]/40 animate-spin" style={{ animationDuration: "12s" }} />
            <span>Guwahati, Assam, India</span>
          </div>
          <span>IST &bull; GMT +5:30</span>
        </div>

        {/* Scroll helper button */}
        <button
          onClick={onScrollToNext}
          className="mx-auto md:mx-0 flex flex-col items-center gap-2 font-mono text-xs text-[#141414] hover:text-[#141414]/70 transition-colors uppercase tracking-[0.2em] font-bold cursor-pointer group"
        >
          <span className="group-hover:translate-y-0.5 transition-transform text-[10px]">Scroll to Explore</span>
          <div className="w-8 h-12 rounded-full border border-[#141414]/25 flex items-start justify-center p-2.5 bg-white/40 shadow-xs">
            <div className="w-1.5 h-2.5 rounded-full bg-[#141414]" />
          </div>
        </button>

        {/* Real-time calculated Local Time */}
        <div className="hidden md:flex flex-col items-end font-mono text-[9px] tracking-widest text-[#141414]/45 uppercase text-right gap-1">
          <div className="flex items-center gap-2">
            <span>Guwahati Time</span>
            <span className="px-1.5 py-0.5 bg-[#141414] text-[#f5f2ed] rounded font-semibold text-[8px]">
              {localTime || "00:00:00"}
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
