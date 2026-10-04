import { useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowLeft, ArrowRight, MoveUpRight } from "lucide-react";
import { BIO_SUMMARY } from "../data";
import SpotlightCard from "./SpotlightCard";
import ScrollFloat from "./ScrollFloat";
import ovcharBg from "../../assets/ovchar.png";
import pic3 from "../../assets/pic3.jpg";

const PROFILE_CARDS = [
  {
    id: "character",
    title: "Character",
    subtitle: "Visual identity",
    image: ovcharBg,
  },
  {
    id: "github",
    title: "GitHub",
    subtitle: "Code archive",
    image: "https://github.com/AAB-I-XES.png",
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    subtitle: "Professional profile",
    image: pic3,
  },
  {
    id: "portfolio",
    title: "Featured",
    subtitle: "Selected work",
    image: null,
  },
  {
    id: "studio",
    title: "Archive",
    subtitle: "Work in progress",
    image: null,
  },
];

export default function BioSection() {
  const containerRef = useRef<HTMLElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [activeCardIdx, setActiveCardIdx] = useState(2);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const imageY = useSpring(useTransform(scrollYProgress, [0, 1], [28, -28]), {
    stiffness: 100,
    damping: 24,
  });

  const moveCard = (direction: 1 | -1) => {
    setActiveCardIdx((current) => (current + direction + PROFILE_CARDS.length) % PROFILE_CARDS.length);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const difference = endX - touchStartX.current;
    if (Math.abs(difference) > 50) moveCard(difference < 0 ? 1 : -1);
    touchStartX.current = null;
  };

  return (
    <section
      id="bio"
      ref={containerRef}
      className="relative isolate flex min-h-screen w-full flex-col justify-center overflow-hidden border-t border-white/10 bg-[#0b0d10] px-6 pt-20 pb-28 text-[#f3f3ee] md:px-12 md:pt-24 md:pb-32"
    >
      <div className="pointer-events-none absolute -right-40 top-12 h-96 w-96 rounded-full bg-white/[0.06] blur-[120px]" />
      <div className="mx-auto mb-12 flex w-full max-w-7xl items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-white">
            02 / About
          </span>
          <span className="hidden text-sm text-white/35 sm:inline">A little context</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          Guwahati, India
        </span>
      </div>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-20">
        <motion.div
          style={{ y: imageY }}
          className="relative order-2 lg:order-1 lg:col-span-5"
        >
          <div
            className="relative mx-auto h-[26rem] w-full max-w-sm touch-pan-y sm:h-[34rem]"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {PROFILE_CARDS.map((card, index) => {
              const offset = index - activeCardIdx;
              const distance = Math.abs(offset);
              const isActive = index === activeCardIdx;
              return (
                <motion.button
                  key={card.id}
                  type="button"
                  aria-label={`Show ${card.title} profile card`}
                  aria-pressed={isActive}
                  onClick={() => setActiveCardIdx(index)}
                  animate={{
                    x: offset * 48,
                    y: distance * 11,
                    scale: isActive ? 1 : Math.max(0.72, 1 - distance * 0.09),
                    opacity: isActive ? 1 : Math.max(0.22, 0.7 - distance * 0.12),
                    rotate: offset * 4,
                  }}
                  transition={{ type: "spring", stiffness: 220, damping: 24 }}
                  className="absolute left-1/2 top-1/2 h-[22rem] w-[15rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#171a20] text-left shadow-[0_30px_90px_rgba(0,0,0,0.45)] sm:h-[27rem] sm:w-[18rem]"
                  style={{ zIndex: 10 - distance }}
                >
                  {card.image ? (
                    <img
                      src={card.image}
                      alt={card.title === "Character" ? "Illustrated character artwork" : `${card.title} profile`}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.18),transparent_40%),linear-gradient(145deg,#252525,#101010)]">
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
                        {card.subtitle}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-black/10" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                    <div>
                      <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-white">
                        Profile / 0{index + 1}
                      </span>
                      <span className="font-display text-2xl text-white">{card.title}</span>
                    </div>
                    <MoveUpRight className="mb-1 h-5 w-5 text-white/70" aria-hidden="true" />
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="mx-auto flex max-w-sm items-center justify-between border-t border-white/10 pt-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
              Profile carousel
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => moveCard(-1)}
                aria-label="Previous profile card"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-[#171a20] text-white transition hover:border-white hover:bg-white hover:text-black"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => moveCard(1)}
                aria-label="Next profile card"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-[#171a20] text-white transition hover:border-white hover:bg-white hover:text-black"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>

        <div className="order-1 space-y-10 lg:order-2 lg:col-span-7">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-white/45">
            <span className="h-px w-8 bg-white" />
            Engineering meets expression
          </div>
          <ScrollFloat containerClassName="max-w-3xl font-display text-4xl leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
            I build useful things with a human point of view.
          </ScrollFloat>
          <SpotlightCard className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
            <p className="relative z-10 text-base leading-8 text-white/65 sm:text-lg">
              {BIO_SUMMARY.intro}
            </p>
            <p className="relative z-10 mt-5 text-base leading-8 text-white/65 sm:text-lg">
              {BIO_SUMMARY.detailedBio}
            </p>
          </SpotlightCard>
          <div className="flex flex-wrap gap-2">
            {["Illustration", "Android", "Creative code", "Product thinking"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-white/60"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
