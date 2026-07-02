import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SKILLS_CATEGORIES } from "../data";
import { SkillCategory } from "../types";
import {
  Palette,
  FileCode,
  Code2,
  Atom,
  Smartphone,
  Layers,
  SmartphoneCharging,
  Cpu,
  Sparkles,
  Award
} from "lucide-react";

// Helper map to dynamically resolve the required lucide icon
const IconMap: { [key: string]: any } = {
  Palette,
  FileCode,
  Code2,
  Atom,
  Smartphone,
  Layers,
  SmartphoneCharging,
  Cpu
};

export default function SkillsSection() {
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);
  const [selectedSkillName, setSelectedSkillName] = useState<string | null>(null);

  const activeCategory = SKILLS_CATEGORIES[activeCategoryIdx];

  return (
    <section
      id="skills"
      className="min-h-screen w-full relative py-20 px-6 md:px-12 bg-[#f5f2ed] border-t border-[#141414]/10 overflow-hidden"
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 sketch-grid-dark opacity-10 pointer-events-none" />

      {/* Title block */}
      <div className="max-w-7xl mx-auto w-full mb-12 flex justify-between items-center border-b border-[#141414]/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#141414]/50 font-bold uppercase tracking-wider">
            03 / EXPERTISE
          </span>
          <span className="font-display font-black text-lg tracking-wider text-[#141414] uppercase">
            SKILLS &amp; DISCIPLINE
          </span>
        </div>
        <span className="font-mono text-[10px] tracking-widest text-[#141414]/50 uppercase hidden sm:inline">
          [ CORE MEDIUMS ]
        </span>
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT INDEX PANEL: CATEGORIES (Ruler Style Side Index) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#141414]/60 uppercase">
              <Award className="w-4 h-4" />
              <span>Skill Categories</span>
            </div>
            <h2 className="font-display font-black text-3xl md:text-4xl tracking-tight text-[#141414] leading-tight uppercase">
              A balanced, dual-core skill architecture
            </h2>
            <p className="font-sans text-[#141414]/75 text-sm leading-relaxed font-semibold">
              My technical expertise bridges heavy low-level algorithms with highly responsive pixel layout rendering and visual sketching.
            </p>
          </div>

          {/* Category List buttons with custom tick animations */}
          <div className="flex flex-col gap-3 pt-6">
            {SKILLS_CATEGORIES.map((cat, idx) => {
              const isActive = idx === activeCategoryIdx;
              return (
                <button
                  key={cat.title}
                  onClick={() => {
                    setActiveCategoryIdx(idx);
                    setSelectedSkillName(null);
                  }}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer relative group ${
                    isActive
                      ? "bg-white border-[#141414] shadow-[4px_4px_0px_#141414]"
                      : "bg-[#f5f2ed]/50 border-[#141414]/10 hover:border-[#141414]/35 hover:bg-white/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-wider text-[#141414]/50">
                      CATEGORY 0{idx + 1}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="active-tick"
                        className="w-1.5 h-1.5 rounded-full bg-[#141414]"
                        transition={{ type: "spring", stiffness: 120, damping: 22 }}
                      />
                    )}
                  </div>
                  <h3 className="font-display font-black text-base tracking-tight text-[#141414] mt-1 group-hover:text-[#141414]/80 uppercase">
                    {cat.title}
                  </h3>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT DETAILS PANEL: SKILLS DISPLAY (Interactive Drafting Metric) */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          
          {/* Header of Active Category */}
          <div className="bg-[#fcebeb] border-2 border-[#141414] p-6 rounded-2xl mb-8 relative shadow-sm">
            <h3 className="font-display font-black text-xl text-[#141414] tracking-tight uppercase">
              {activeCategory.title}
            </h3>
            <p className="font-sans text-xs text-[#141414]/75 leading-relaxed mt-2 font-semibold">
              {activeCategory.description}
            </p>
          </div>

          {/* List of Skills styled as technical drafting scale lines */}
          <div className="space-y-6">
            {activeCategory.skills.map((skill) => {
              const IconComp = IconMap[skill.iconName] || Code2;
              const isSelected = selectedSkillName === skill.name;

              return (
                <div
                  key={skill.name}
                  onClick={() => setSelectedSkillName(isSelected ? null : skill.name)}
                  className={`bg-white rounded-xl border-2 transition-all p-5 cursor-pointer relative group ${
                    isSelected
                      ? "border-[#141414] shadow-[4px_4px_0px_#141414]"
                      : "border-[#141414]/10 hover:border-[#141414]/30 hover:shadow-xs"
                  }`}
                >
                  {/* Skill main row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#f5f2ed] flex items-center justify-center text-[#141414]/85 border border-[#141414]/10 group-hover:scale-105 transition-transform">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-black text-base text-[#141414] tracking-tight uppercase">
                          {skill.name}
                        </h4>
                        <span className="font-mono text-[9px] tracking-wider text-[#141414]/40 uppercase">
                          LEVEL: {skill.level}/5 &bull; CLICK TO INSPECT
                        </span>
                      </div>
                    </div>

                    {/* Minimalist proficiency bar */}
                    <div className="flex-1 max-w-xs flex flex-col gap-1.5">
                      <div className="flex justify-between items-center font-mono text-[9px] text-[#141414]/50">
                        <span>PROFICIENCY</span>
                        <span>LEVEL {skill.level}/5</span>
                      </div>
                      
                      {/* The scale ruler track */}
                      <div className="h-2 bg-[#141414]/10 rounded-full relative overflow-hidden">
                        {/* Animated progress bar overlay */}
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level * 20}%` }}
                          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full bg-[#141414] rounded-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expandable technical details box */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } }}
                        exit={{ height: 0, opacity: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-dashed border-[#141414]/10 bg-[#f5f2ed]/50 p-3 rounded-lg font-sans text-xs text-[#141414]/80 leading-relaxed flex items-start gap-2.5">
                          <Sparkles className="w-4 h-4 text-[#141414] shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <span className="font-mono text-[9px] uppercase tracking-wider text-[#141414]/50 block">
                              Application Context
                            </span>
                            <p className="font-sans text-xs">{skill.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>



        </div>

      </div>
    </section>
  );
}
