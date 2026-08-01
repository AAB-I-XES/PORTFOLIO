import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { PenTool } from "lucide-react";
import { BIO_SUMMARY } from "../data";
import studioPhoto from "../../assets/ovchar.png";

export default function BioSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const bioY = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -40]);
  const smoothBioY = useSpring(bioY, { stiffness: 100, damping: 20 });

  const fullBioText = `${BIO_SUMMARY.intro} ${BIO_SUMMARY.detailedBio}`;
  const words = fullBioText.split(" ");
  const wordCount = words.length;

  return (
    <section
      id="bio"
      ref={containerRef}
      className="min-h-screen w-full relative flex flex-col justify-center py-20 px-6 md:px-12 bg-[#fcebeb] border-t border-[#141414]/10 overflow-hidden"
    >
      <div className="absolute inset-0 sketch-grid-dark opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full mb-12 flex justify-between items-center border-b border-[#141414]/10 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#141414]/50 font-bold uppercase tracking-wider">
            02 / BIOGRAPHY
          </span>
          <span className="font-display font-black text-lg tracking-wider text-[#141414] uppercase">
            Story &amp; Creative Mindset
          </span>
        </div>
        <span className="font-mono text-[10px] tracking-widest text-[#141414]/50 uppercase hidden sm:inline">
          [ SCROLL PROGRESS ]
        </span>
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <motion.div
          style={{ y: smoothBioY }}
          className="lg:col-span-7 space-y-8"
        >
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#141414]/60 uppercase">
            <PenTool className="w-4 h-4 text-[#141414]/70" />
            <span>Background</span>
          </div>

          <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight text-[#141414] leading-tight uppercase">
            Drafting interfaces with <span className="font-serif italic font-normal text-stroke-black">artistic intent</span>
          </h2>

          <div className="text-[#141414]/30 font-sans text-base md:text-xl md:leading-relaxed font-semibold tracking-wide select-text">
            {words.map((word, index) => {
              const startRange = 0.12 + (index / wordCount) * 0.45;
              const endRange = startRange + 0.05;

              const wordOpacity = useTransform(scrollYProgress, [startRange, endRange], [0.15, 1.0]);
              const wordColor = useTransform(scrollYProgress, [startRange, endRange], ["#14141430", "#141414"]);

              return (
                <motion.span
                  key={index}
                  style={{ opacity: wordOpacity, color: wordColor }}
                  className="inline-block mr-1.5 transition-colors duration-100"
                >
                  {word}
                </motion.span>
              );
            })}
          </div>

          <div className="pt-4 flex flex-wrap gap-3">
            <span className="font-mono text-xs px-3 py-1.5 rounded-full border border-[#141414]/15 bg-white/50 text-[#141414]/85">
              #CreativeIllustration
            </span>
            <span className="font-mono text-xs px-3 py-1.5 rounded-full border border-[#141414]/15 bg-white/50 text-[#141414]/85">
              #AndroidDevelopment
            </span>
            <span className="font-mono text-xs px-3 py-1.5 rounded-full border border-[#141414]/15 bg-white/50 text-[#141414]/85">
              #FunctionalArt
            </span>
          </div>
        </motion.div>

        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-[#f5f2ed] rounded-2xl border-2 border-[#141414] p-4 shadow-[4px_4px_0px_#141414] relative overflow-hidden flex flex-col">
            <div className="flex items-center justify-between border-b border-[#141414]/10 pb-3 mb-3">
              <div className="font-mono text-xs uppercase font-bold text-[#141414]">
                Profile Snapshot
              </div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-[#141414]/50">
                Studio Frame
              </div>
            </div>

            <div className="relative w-full h-72 md:h-80 rounded-xl overflow-hidden border-2 border-dashed border-[#141414]/15 bg-white/65">
              <img
                src={studioPhoto}
                alt="Profile portrait"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/10" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-full border border-white/45 bg-[#141414]/50 px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.28em] text-white/90 backdrop-blur-sm">
                <span>Student</span>
                <span>Builder</span>
                <span>Visual Thinker</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] font-mono tracking-widest text-[#141414]/50 uppercase flex justify-between px-2">
            <span>PROFILE FRAME</span>
            <span>PHOTO PRESENTATION</span>
          </div>
        </div>
      </div>
    </section>
  );
}
