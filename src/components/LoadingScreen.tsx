import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LoadingScreenProps {
  onComplete: () => void;
  onExitStart?: () => void;
}

const SHUTTER_COUNT = 5;
const LOAD_DURATION = 2800;
const EXIT_DURATION = 1500;

export default function LoadingScreen({ onComplete, onExitStart }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const onCompleteRef = useRef(onComplete);
  const onExitStartRef = useRef(onExitStart);

  onCompleteRef.current = onComplete;
  onExitStartRef.current = onExitStart;

  useEffect(() => {
    const startedAt = performance.now();
    let exitTimer: number | undefined;
    let completeTimer: number | undefined;
    const progressTimer = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      const nextProgress = Math.min((elapsed / LOAD_DURATION) * 100, 100);
      setProgress(nextProgress);

      if (nextProgress >= 100) {
        window.clearInterval(progressTimer);
        exitTimer = window.setTimeout(() => {
          onExitStartRef.current?.();
          setIsDone(true);
          completeTimer = window.setTimeout(() => onCompleteRef.current(), EXIT_DURATION);
        }, 300);
      }
    }, 24);

    return () => {
      window.clearInterval(progressTimer);
      if (exitTimer !== undefined) window.clearTimeout(exitTimer);
      if (completeTimer !== undefined) window.clearTimeout(completeTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          id="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.55, ease: "easeOut" } }}
          className="fixed inset-0 z-[150] overflow-hidden select-none bg-[#ededed] text-[#141414]"
          aria-label="Loading portfolio"
          role="status"
        >
          <div className="animated-gradient-background absolute inset-0" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.18),_transparent_55%)]" />
          <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.22]" aria-hidden="true">
            <div className="absolute left-0 top-[35%] h-px w-full bg-[#141414]/10" />
            <div className="absolute left-0 top-[65%] h-px w-full bg-[#141414]/10" />
            <div className="absolute left-[25%] top-0 h-full w-px bg-[#141414]/10" />
            <div className="absolute left-[75%] top-0 h-full w-px bg-[#141414]/10" />
          </div>
          <motion.div
            className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/55 to-transparent"
            animate={{ x: ["0vw", "160vw"] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
          />

          <div className="pointer-events-none absolute inset-4 border border-[#141414]/10 md:inset-8">
            <span className="absolute -left-px -top-px h-8 w-8 border-l-2 border-t-2 border-[#141414]/35" />
            <span className="absolute -right-px -top-px h-8 w-8 border-r-2 border-t-2 border-[#141414]/35" />
            <span className="absolute -bottom-px -left-px h-8 w-8 border-b-2 border-l-2 border-[#141414]/35" />
            <span className="absolute -bottom-px -right-px h-8 w-8 border-b-2 border-r-2 border-[#141414]/35" />
            <span className="absolute left-3 top-3 font-mono text-[8px] tracking-[0.2em] text-[#141414]/35">
              DRAFT_SHEET / 01
            </span>
            <span className="absolute right-3 top-3 font-mono text-[8px] tracking-[0.2em] text-[#141414]/35">
              GUWAHATI / IN
            </span>
          </div>

          <div className="absolute inset-0 z-10 flex flex-col justify-between px-8 py-8 md:px-16 md:py-12">
            <header className="flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#141414]/60 sm:text-xs">
              <span className="font-semibold text-[#141414]">Dibyajyoti Rabha</span>
              <span className="hidden sm:block">Creative developer / Illustrator</span>
            </header>

            <main className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
              <div className="relative mb-8 grid h-36 w-36 place-items-center sm:mb-9 sm:h-40 sm:w-40">
                <motion.div
                  className="absolute inset-0 rounded-full border border-[#141414]/15"
                  animate={{ rotate: 360, scale: [1, 1.04, 1] }}
                  transition={{ rotate: { duration: 18, repeat: Infinity, ease: "linear" }, scale: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
                />
                <motion.div
                  className="absolute inset-3 rounded-full border border-dashed border-[#141414]/25"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                >
                  <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-[#141414]" />
                </motion.div>
                <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#141414]/10" />
                <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#141414]/10" />
                <motion.span
                  initial={{ opacity: 0, scale: 0.55, rotate: -18 }}
                  animate={{ opacity: 1, scale: [1, 1.06, 1], rotate: 0 }}
                  transition={{ opacity: { delay: 0.25, duration: 0.45 }, scale: { delay: 0.5, duration: 2.4, repeat: Infinity }, rotate: { delay: 0.25, duration: 0.7 } }}
                  className="relative z-10 font-display text-6xl tracking-[-0.12em] text-[#141414]"
                  aria-hidden="true"
                >
                  DR
                </motion.span>
                <span className="absolute bottom-[-1.15rem] font-mono text-[8px] tracking-[0.25em] text-[#141414]/45">
                  DESIGN / ENGINEERING
                </span>
              </div>

              <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#141414]/50 sm:text-[10px]">
                Studio of / Guwahati, India
              </p>
              <h1 className="mt-3 flex flex-col font-display text-[clamp(2.4rem,8vw,5.5rem)] uppercase leading-[0.82] tracking-[0.035em]">
                {["DIBYAJYOTI", "RABHA"].map((line, lineIndex) => (
                  <span key={line} className="flex justify-center overflow-hidden py-1">
                    {Array.from(line).map((letter, letterIndex) => (
                      <motion.span
                        key={`${line}-${letterIndex}`}
                        initial={{ y: "110%", opacity: 0, rotateX: -70 }}
                        animate={{ y: "0%", opacity: 1, rotateX: 0 }}
                        transition={{
                          delay: 0.38 + lineIndex * 0.24 + letterIndex * 0.045,
                          duration: 0.72,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="inline-block"
                        aria-hidden="true"
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </span>
                ))}
                <span className="sr-only">Dibyajyoti Rabha</span>
              </h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4 h-px w-full max-w-sm origin-left bg-[#141414]/35"
              />
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.15, duration: 0.55 }}
                className="mt-4 font-mono text-[9px] uppercase tracking-[0.25em] text-[#141414]/55 sm:text-[10px]"
              >
                Creative developer <span className="px-2">/</span> Illustrator
              </motion.p>
              <p className="mt-3 max-w-sm text-xs leading-6 text-[#141414]/55 sm:text-sm">
                Bringing ideas to life through thoughtful design and code.
              </p>

              {/* Loading status */}
              <div className="mt-7 w-full max-w-xs">
                <div className="mb-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.16em] text-[#141414]/50">
                  <span>Rendering experience</span>
                  <span>{Math.round(progress).toString().padStart(2, "0")}%</span>
                </div>
                <div
                  className="relative h-[3px] w-full overflow-hidden bg-[#141414]/10"
                  role="progressbar"
                  aria-label="Loading portfolio"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress)}
                >
                  <motion.div
                    className="h-full bg-[#141414]"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.12, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute inset-y-0 w-10 bg-gradient-to-r from-transparent via-white/80 to-transparent"
                    animate={{ left: ["-2.5rem", "100%"] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              </div>
            </main>

            <footer className="flex items-end justify-between gap-4 border-t border-[#141414]/15 pt-4 font-mono text-[8px] uppercase tracking-[0.16em] text-[#141414]/45 sm:text-[9px]">
              <span>Independent digital studio</span>
              <span>Portfolio / 2026</span>
            </footer>
          </div>

          <div className="absolute inset-0 z-0 flex" aria-hidden="true">
            {Array.from({ length: SHUTTER_COUNT }, (_, index) => (
              <motion.div
                key={index}
                initial={{ scaleY: 1 }}
                exit={{
                  scaleY: 0,
                  transition: {
                    duration: 1.05,
                    delay: index * 0.11,
                    ease: [0.76, 0, 0.24, 1],
                  },
                }}
                style={{
                  originY: index % 2 === 0 ? 0 : 1,
                  backgroundColor: index % 2 === 0 ? "#ededed" : "#e3e3e3",
                }}
                className="h-full flex-1 border-r border-[#141414]/[0.035] last:border-r-0"
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
