import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LoadingScreenProps {
  onComplete: () => void;
  onExitStart?: () => void;
}

export default function LoadingScreen({ onComplete, onExitStart }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const duration = 2800; // 2.8 seconds loader (slower, more comfortable build-up)
    const intervalTime = 20;
    const step = 100 / (duration / intervalTime);
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsDone(true);
            if (onExitStart) onExitStart();
            setTimeout(onComplete, 2900); // Wait for the longer elegant exit animation (2.9s)
          }, 500);
          return 100;
        }
        return Math.min(prev + step, 100);
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete, onExitStart]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          id="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 2.7, duration: 0.2 } }}
          className="fixed inset-0 z-[150] overflow-hidden select-none bg-transparent"
        >
          {/* Staggered Vertical Shutter Panels (Slide away on exit) */}
          <div className="absolute inset-0 z-0 flex">
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scaleY: 1 }}
                exit={{ 
                  scaleY: 0,
                  transition: { 
                    duration: 1.8, 
                    delay: 0.2 + i * 0.24, 
                    ease: [0.16, 1, 0.3, 1] 
                  } 
                }}
                style={{ originY: i % 2 === 0 ? 0 : 1 }}
                className="flex-1 h-full bg-[#f5f2ed] border-r border-[#141414]/5 last:border-r-0"
              />
            ))}
          </div>

          {/* Core Loading Content (Fades out early during transition) */}
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            exit={{ 
              opacity: 0, 
              scale: 0.94, 
              filter: "blur(10px)", 
              transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
            }}
            className="absolute inset-0 z-10 flex flex-col justify-between p-8 md:p-12 bg-transparent"
          >
            {/* Top Line & Labels */}
            <div className="flex justify-between items-center font-mono text-xs tracking-widest text-[#141414]/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#141414] animate-ping" />
                <span>DIBYAJYOTI RABHA</span>
              </div>
              <span>PORTFOLIO PRELOAD // 2026</span>
            </div>

            {/* Central Sketch Animation */}
            <div className="flex flex-col items-center justify-center my-auto relative">
              {/* Elegant Sketch Frame Box */}
              <div className="w-64 h-64 md:w-80 md:h-80 border border-[#141414]/10 flex items-center justify-center relative bg-white/45 rounded-lg p-6 overflow-hidden shadow-sm">
                <div className="absolute inset-0 sketch-grid-dark opacity-10" />
                
                {/* Handcrafted drawing path that auto-draws */}
                <svg className="w-full h-full relative z-10 text-[#141414]" viewBox="0 0 100 100" fill="none">
                  {/* Decorative background circle */}
                  <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" className="opacity-30" />
                  
                  {/* Handdrawn style initial outlines */}
                  <motion.path
                    d="M25 35 C35 25, 65 25, 75 35 C85 45, 85 55, 75 65 C65 75, 35 75, 25 65 C15 55, 15 45, 25 35 Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2.6, ease: "easeInOut" }}
                  />
                  
                  {/* Internal stylized geometry representing "D" & "R" */}
                  <motion.path
                    d="M40 32 L40 68"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.4, duration: 2.0, ease: "easeInOut" }}
                  />
                  <motion.path
                    d="M40 32 C55 32, 58 45, 40 48"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.8, duration: 1.8, ease: "easeInOut" }}
                  />
                  <motion.path
                    d="M40 48 C55 48, 62 68, 58 68"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1.1, duration: 1.8, ease: "easeInOut" }}
                  />
                  <motion.path
                    d="M28 50 L72 50"
                    stroke="#ffd6e0"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.7, duration: 2.2, ease: "easeInOut" }}
                  />
                </svg>

                {/* Little label */}
                <div className="absolute bottom-4 left-0 right-0 text-center font-mono text-[10px] tracking-wider text-[#141414]/40">
                  [ ASSEMBLING VECTOR ASSETS ]
                </div>
              </div>

              {/* Live progress percentage */}
              <div className="mt-8 text-center">
                <div className="font-serif italic text-6xl text-[#141414] font-normal tracking-tighter">
                  {Math.round(progress)}<span className="text-xs font-mono align-super">%</span>
                </div>
                <div className="font-mono text-xs tracking-[0.3em] uppercase mt-2 text-[#141414]/60 font-bold">
                  Crafting Canvas
                </div>
              </div>
            </div>

            {/* Bottom Info Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center font-mono text-[10px] tracking-wider text-[#141414]/40 border-t border-[#141414]/10 pt-4 gap-2 text-center">
              <span>D.RABHA &copy; 2026 &mdash; ALL RIGHTS OBSERVED</span>
              <span className="hidden sm:inline">|</span>
              <span>BEIGE / SOFT PINK / CHARCOAL SYSTEM</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
