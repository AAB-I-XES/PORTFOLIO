import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Award,
  Atom,
  Code2,
  Cpu,
  FileCode,
  Layers,
  Palette,
  Smartphone,
  SmartphoneCharging,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { SKILLS_CATEGORIES } from "../data";
import LiquidButton from "./LiquidButton";
import SpotlightCard from "./SpotlightCard";

const ICONS: Record<string, LucideIcon> = {
  Palette,
  FileCode,
  Code2,
  Atom,
  Smartphone,
  Layers,
  SmartphoneCharging,
  Cpu,
};

export default function SkillsSection() {
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);
  const [selectedSkillName, setSelectedSkillName] = useState<string | null>(null);
  const activeCategory = SKILLS_CATEGORIES[activeCategoryIdx] ?? SKILLS_CATEGORIES[0];

  if (!activeCategory) return null;

  return (
    <section
      id="skills"
      className="relative isolate w-full overflow-hidden border-t border-white/10 bg-[#101318] px-6 py-28 text-[#f3f3ee] md:px-12 md:py-32"
    >
      <div className="pointer-events-none absolute -left-48 top-1/3 h-[30rem] w-[30rem] rounded-full bg-white/[0.055] blur-[130px]" />
      <div className="mx-auto mb-16 flex w-full max-w-7xl items-end justify-between border-b border-white/10 pb-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-white">
            03 / Capabilities
          </span>
          <h2 className="mt-4 max-w-2xl font-display text-4xl tracking-tight sm:text-5xl">
            A toolkit for ideas that move.
          </h2>
        </div>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-white/35 md:block">
          Skills &amp; practice
        </span>
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="space-y-9 lg:col-span-4">
          <div className="flex items-center gap-3 text-sm text-white/50">
            <Award className="h-4 w-4 text-white" aria-hidden="true" />
            <span>Choose a discipline</span>
          </div>
          <p className="max-w-md text-sm leading-7 text-white/50">
            From interface craft to native development and systems fundamentals, explore the
            disciplines behind my work.
          </p>

          <div className="grid gap-3">
            {SKILLS_CATEGORIES.map((category, index) => {
              const isActive = index === activeCategoryIdx;
              return (
                <LiquidButton
                  key={category.title}
                  type="button"
                  fullWidth
                  radius={16}
                  active={isActive}
                  onClick={() => {
                    setActiveCategoryIdx(index);
                    setSelectedSkillName(null);
                  }}
                  aria-pressed={isActive}
                  className={`group relative w-full overflow-hidden rounded-xl border p-4 text-left transition-colors ${
                    isActive
                      ? "border-white/45 text-white"
                      : "border-white/20 text-white/75 hover:border-white/45"
                  }`}
                >
                  <span className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
                    Discipline 0{index + 1}
                    <span className={`h-2 w-2 rounded-full ${isActive ? "bg-white" : "bg-white/15"}`} />
                  </span>
                  <span className="mt-3 block text-sm font-medium text-white">
                    {category.title}
                  </span>
                </LiquidButton>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28 }}
            >
              <div className="mb-8 border-l-2 border-white pl-5">
                <h3 className="font-display text-2xl text-white">{activeCategory.title}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
                  {activeCategory.description}
                </p>
              </div>
              <div className="grid gap-3">
                {activeCategory.skills.map((skill, index) => {
                  const Icon = ICONS[skill.iconName] ?? Code2;
                  const isExpanded = selectedSkillName === skill.name;
                  return (
                    <SpotlightCard
                      key={skill.name}
                      className={`rounded-xl border bg-[#171a20] p-5 transition-colors ${
                        isExpanded ? "border-white/40" : "border-white/[0.08]"
                      }`}
                    >
                      <LiquidButton
                        type="button"
                        fullWidth
                        radius={14}
                        active={isExpanded}
                        onClick={() => setSelectedSkillName(isExpanded ? null : skill.name)}
                        aria-expanded={isExpanded}
                        className="relative z-10 flex w-full flex-col gap-5 text-left sm:flex-row sm:items-center sm:justify-between"
                      >
                        <span className="flex min-w-0 items-center gap-4">
                          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white">
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-medium text-white">{skill.name}</span>
                            <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-white/35">
                              {skill.level > 0 ? `Level ${skill.level} of 5` : "Exploring"}
                            </span>
                          </span>
                        </span>
                        <span className="flex w-full max-w-48 items-center gap-3 sm:w-40">
                          <span className="grid flex-1 grid-cols-5 gap-1" aria-hidden="true">
                            {Array.from({ length: 5 }, (_, level) => (
                              <span
                                key={level}
                                className={`h-1.5 rounded-full ${
                                  level < skill.level ? "bg-white" : "bg-white/10"
                                }`}
                              />
                            ))}
                          </span>
                          <span className="font-mono text-[10px] text-white/35">
                            0{index + 1}
                          </span>
                        </span>
                      </LiquidButton>
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="relative z-10 overflow-hidden"
                          >
                            <p className="mt-5 flex gap-3 border-t border-white/10 pt-4 text-sm leading-6 text-white/55">
                              <Sparkles className="mt-1 h-4 w-4 shrink-0 text-white" aria-hidden="true" />
                              {skill.description}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </SpotlightCard>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
