import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { PenTool } from "lucide-react";
import { BIO_SUMMARY } from "../data";

const GITHUB_PROFILE_PHOTO = "https://github.com/AAB-I-XES.png";
const LINKEDIN_PROFILE_PHOTO = "https://github.com/AAB-I-XES.png";

const PROFILE_CARDS = [
  {
    id: "github",
    title: "GitHub",
    subtitle: "Code Archive",
    image: GITHUB_PROFILE_PHOTO,
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    subtitle: "Professional Pulse",
    image: LINKEDIN_PROFILE_PHOTO,
  },
  {
    id: "portfolio",
    title: "Featured",
    subtitle: "Creative Identity",
    image: null,
  },
  {
    id: "studio",
    title: "Archive",
    subtitle: "Coming Soon",
    image: null,
  },
];

export default function BioSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCardIdx, setActiveCardIdx] = useState(1);

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
          <div className="relative flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-3">
              <div className="font-mono text-xs uppercase font-bold text-[#141414]">
                Profile Snapshot
              </div>
              <button
                type="button"
                onClick={() => setActiveCardIdx((prev) => (prev + 1) % PROFILE_CARDS.length)}
                className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#141414] border border-[#141414]/15 bg-white/70 px-3 py-1.5 rounded-full transition hover:bg-[#ffd6e0]"
              >
                Switch
              </button>
            </div>

            <div className="relative h-[26rem] md:h-[32rem] w-full overflow-visible">
              {PROFILE_CARDS.map((card, idx) => {
                const offset = idx - activeCardIdx;
                const distance = Math.abs(offset);
                const isActive = idx === activeCardIdx;

                return (
                  <motion.button
                    key={card.id}
                    type="button"
                    onClick={() => setActiveCardIdx(idx)}
                    animate={{
                      x: offset * 110,
                      scale: isActive ? 1.12 : Math.max(0.72, 1 - distance * 0.12),
                      y: isActive ? 0 : distance * 22,
                      opacity: isActive ? 1 : 0.72 - distance * 0.12,
                      filter: isActive ? "blur(0px)" : "blur(0.4px)",
                    }}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    className="absolute top-1/2 left-1/2 h-[20rem] md:h-[24rem] w-[14rem] md:w-[16rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[22px] bg-[#f5f2ed] shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
                    style={{ zIndex: 20 - distance }}
                  >
                    {card.image ? (
                      <>
                        <div className="h-full w-full border-[10px] border-[#f5f2ed] bg-[#f5f2ed]">
                          <img
                            src={card.image}
                            alt={card.title}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/10" />
                      </>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,_#fff6f8,_#f5f2ed_50%,_#e6dfd3)] p-6 text-center">
                        <div className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#141414]/55">
                          {card.subtitle}
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-full bg-[#141414]/55 px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.28em] text-white/90 backdrop-blur-sm">
                      <span>Profile</span>
                      <span>{isActive ? "Focus" : "View"}</span>
                    </div>
                  </motion.button>
                );
              })}
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
