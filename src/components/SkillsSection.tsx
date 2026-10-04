import {
  Atom,
  Code2,
  Cpu,
  FileCode,
  Layers,
  Palette,
  Smartphone,
  SmartphoneCharging,
  type LucideIcon,
} from "lucide-react";
import { SKILLS_CATEGORIES } from "../data";
import ScrollFloat from "./ScrollFloat";
import ScrollStack, { ScrollStackItem } from "./ScrollStack";

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
  return (
    <section
      id="skills"
      className="relative isolate w-full overflow-hidden border-t border-white/10 bg-[#101318] px-6 pt-20 pb-28 text-[#f3f3ee] md:px-12 md:pt-24 md:pb-32"
    >
      <div className="pointer-events-none absolute -left-48 top-1/3 h-[30rem] w-[30rem] rounded-full bg-white/[0.055] blur-[130px]" />
      <div className="relative mx-auto mb-12 flex w-full max-w-7xl items-end justify-between border-b border-white/10 pb-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-white">
            03 / Capabilities
          </span>
          <ScrollFloat containerClassName="mt-4 max-w-2xl font-display text-4xl tracking-tight sm:text-5xl">
            A toolkit for ideas that move.
          </ScrollFloat>
        </div>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-white/35 md:block">
          Skills &amp; practice
        </span>
      </div>

      <ScrollStack
        className="mx-auto max-w-7xl"
        itemDistance={54}
        itemScale={0.035}
        itemStackDistance={28}
        stackPosition="14%"
        scaleEndPosition="7%"
        baseScale={0.92}
      >
        {SKILLS_CATEGORIES.map((category, categoryIndex) => (
          <ScrollStackItem
            key={category.title}
            itemClassName="border border-white/10 bg-[#171a20] text-white shadow-[0_28px_70px_rgba(0,0,0,0.38)]"
          >
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div className="min-w-0">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                  Discipline 0{categoryIndex + 1} / 0{SKILLS_CATEGORIES.length}
                </span>
                <h3 className="mt-3 max-w-3xl font-display text-2xl leading-tight sm:text-3xl">
                  {category.title}
                </h3>
              </div>
              <span className="font-mono text-xs text-white/35">
                {String(categoryIndex + 1).padStart(2, "0")}
              </span>
              <p className="w-full max-w-3xl text-sm leading-6 text-white/55">
                {category.description}
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {category.skills.map((skill) => {
                const Icon = ICONS[skill.iconName] ?? Code2;
                return (
                  <article
                    key={skill.name}
                    className="min-w-0 border border-white/[0.08] bg-white/[0.025] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center border border-white/10 bg-white/[0.04] text-white/80">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-medium leading-5 text-white">
                          {skill.name}
                        </h4>
                        <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.12em] text-white/35">
                          {skill.level > 0 ? `Level ${skill.level} of 5` : "Exploring"}
                        </span>
                      </div>
                    </div>
                    <p className="mt-4 text-xs leading-5 text-white/50">
                      {skill.description}
                    </p>
                    <div className="mt-4 grid grid-cols-5 gap-1" role="img" aria-label={`${skill.level} of 5 proficiency`}>
                      {Array.from({ length: 5 }, (_, level) => (
                        <span
                          key={`${skill.name}-${level}`}
                          className={`h-1 ${level < skill.level ? "bg-white/75" : "bg-white/10"}`}
                        />
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </section>
  );
}