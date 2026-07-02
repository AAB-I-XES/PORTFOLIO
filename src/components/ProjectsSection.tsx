import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Project } from "../types";
import { 
  FolderGit2, 
  Calendar, 
  Star, 
  Compass, 
  Tag, 
  Hammer, 
  ChevronRight, 
  GitFork, 
  ExternalLink,
  Code2,
  RefreshCw
} from "lucide-react";

// Robust static fallback representing the actual public repositories of AAB-I-XES
const GITHUB_FALLBACK_PROJECTS: Project[] = [
  {
    id: "harmonic",
    title: "HARMONIC",
    category: "Kotlin Mobile App",
    description: "An elegant, performant open source music streaming and audio management application engineered natively in Kotlin.",
    tags: ["Kotlin", "Android", "Mobile Audio", "Music Streamer", "ExoPlayer"],
    role: "Creator & Maintainer",
    year: "2026",
    color: "pink",
    accentColor: "#ffd6e0",
    isFeatured: true,
    htmlUrl: "https://github.com/AAB-I-XES/HARMONIC",
    stars: 1,
    forks: 0,
    isFork: false,
  },
  {
    id: "piannaa",
    title: "piannaa",
    category: "TypeScript Audio Web",
    description: "A highly interactive digital piano interface featuring lightweight audio synthesis mechanics and hand-drawn layout visuals.",
    tags: ["TypeScript", "Web Audio API", "Digital Piano", "Interactive SVG"],
    role: "Creator & Maintainer",
    year: "2026",
    color: "beige",
    accentColor: "#E6DFD3",
    isFeatured: true,
    htmlUrl: "https://github.com/AAB-I-XES/piannaa",
    stars: 0,
    forks: 0,
    isFork: false,
  },
  {
    id: "compose-multiplatform",
    title: "compose-multiplatform",
    category: "Kotlin UI Framework (Fork)",
    description: "Personal development branch exploring declarative UI capabilities across Android, iOS, Desktop, and Web from the main Jetpack Compose multiplatform repo.",
    tags: ["Kotlin", "Compose", "Multiplatform", "Declarative UI"],
    role: "Contributor (Forked)",
    year: "2026",
    color: "white",
    accentColor: "#FFFFFF",
    isFeatured: false,
    htmlUrl: "https://github.com/AAB-I-XES/compose-multiplatform",
    stars: 0,
    forks: 0,
    isFork: true,
  },
  {
    id: "linux",
    title: "linux",
    category: "C Kernel Source (Fork)",
    description: "A personal developmental environment mapping low-level systems programming, drivers, and kernel mechanics from the Linux source tree.",
    tags: ["C", "Linux Kernel", "Low Level Systems", "Memory Layouts"],
    role: "Contributor (Forked)",
    year: "2026",
    color: "dark",
    accentColor: "#111111",
    isFeatured: false,
    htmlUrl: "https://github.com/AAB-I-XES/linux",
    stars: 0,
    forks: 0,
    isFork: true,
  },
  {
    id: "nowinandroid",
    title: "nowinandroid",
    category: "Kotlin Android Spec (Fork)",
    description: "A comprehensive model showcasing top-tier Android programming practices, dependency injections, and modern Jetpack Compose layouts.",
    tags: ["Kotlin", "Android Spec", "Clean Architecture", "Hilt"],
    role: "Contributor (Forked)",
    year: "2026",
    color: "pink",
    accentColor: "#ffd6e0",
    isFeatured: false,
    htmlUrl: "https://github.com/AAB-I-XES/nowinandroid",
    stars: 0,
    forks: 0,
    isFork: true,
  }
];

// Procedural blueprint-style vector schematic graphics matching user projects
const ProjectSchematic = ({ id }: { id: string }) => {
  const normId = id.toLowerCase();
  
  if (normId.includes("harmonic")) {
    return (
      <svg className="w-full h-full text-[#141414]/10 stroke-current" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="38" strokeWidth="0.5" strokeDasharray="3 3" />
        <path d="M15 50 Q32.5 15, 50 50 T85 50" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M15 50 Q32.5 85, 50 50 T85 50" strokeWidth="0.4" strokeDasharray="2 1" strokeLinecap="round" />
        <circle cx="50" cy="50" r="14" strokeWidth="0.6" />
        <circle cx="50" cy="50" r="2" fill="currentColor" opacity="0.4" />
      </svg>
    );
  }
  if (normId.includes("piannaa")) {
    return (
      <svg className="w-full h-full text-[#141414]/10 stroke-current" viewBox="0 0 100 100" fill="none">
        <rect x="15" y="15" width="70" height="70" rx="3" strokeWidth="0.6" />
        <line x1="26.6" y1="15" x2="26.6" y2="85" strokeWidth="0.4" />
        <line x1="38.3" y1="15" x2="38.3" y2="85" strokeWidth="0.4" />
        <line x1="50" y1="15" x2="50" y2="85" strokeWidth="0.4" />
        <line x1="61.6" y1="15" x2="61.6" y2="85" strokeWidth="0.4" />
        <line x1="73.3" y1="15" x2="73.3" y2="85" strokeWidth="0.4" />
        {/* Black keys */}
        <rect x="23" y="15" width="6" height="42" fill="currentColor" opacity="0.12" />
        <rect x="35" y="15" width="6" height="42" fill="currentColor" opacity="0.12" />
        <rect x="58" y="15" width="6" height="42" fill="currentColor" opacity="0.12" />
        <rect x="70" y="15" width="6" height="42" fill="currentColor" opacity="0.12" />
      </svg>
    );
  }
  if (normId.includes("compose")) {
    return (
      <svg className="w-full h-full text-[#141414]/10 stroke-current" viewBox="0 0 100 100" fill="none">
        <rect x="22" y="22" width="46" height="46" rx="5" strokeWidth="0.8" />
        <rect x="32" y="32" width="46" height="46" rx="5" strokeWidth="0.4" strokeDasharray="3 2" />
        <circle cx="50" cy="50" r="12" strokeWidth="0.5" strokeDasharray="1 1" />
        <line x1="22" y1="22" x2="78" y2="78" strokeWidth="0.3" />
      </svg>
    );
  }
  if (normId.includes("linux")) {
    return (
      <svg className="w-full h-full text-[#141414]/10 stroke-current" viewBox="0 0 100 100" fill="none">
        <rect x="15" y="20" width="70" height="60" rx="4" strokeWidth="0.8" />
        <line x1="15" y1="35" x2="85" y2="35" strokeWidth="0.5" />
        <path d="M24 45 L30 50 L24 55" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="34" y1="55" x2="48" y2="55" strokeWidth="0.8" strokeLinecap="round" />
        <circle cx="68" cy="27" r="1.5" strokeWidth="0.5" />
        <circle cx="74" cy="27" r="1.5" strokeWidth="0.5" />
        <circle cx="80" cy="27" r="1.5" strokeWidth="0.5" />
      </svg>
    );
  }
  if (normId.includes("nowinandroid") || normId.includes("android")) {
    return (
      <svg className="w-full h-full text-[#141414]/10 stroke-current" viewBox="0 0 100 100" fill="none">
        <rect x="30" y="15" width="40" height="70" rx="7" strokeWidth="0.8" />
        <line x1="30" y1="24" x2="70" y2="24" strokeWidth="0.5" />
        <line x1="30" y1="76" x2="70" y2="76" strokeWidth="0.5" />
        <circle cx="50" cy="19" r="1.2" fill="currentColor" opacity="0.3" />
        <circle cx="50" cy="81" r="2.5" strokeWidth="0.5" />
        <rect x="36" y="30" width="28" height="38" rx="2" strokeWidth="0.4" strokeDasharray="2 2" />
      </svg>
    );
  }
  // Default vector outline for standard repositories
  return (
    <svg className="w-full h-full text-[#141414]/10 stroke-current" viewBox="0 0 100 100" fill="none">
      <rect x="20" y="20" width="60" height="60" rx="2" strokeWidth="0.5" />
      <circle cx="50" cy="50" r="22" strokeWidth="0.6" />
      <line x1="20" y1="50" x2="80" y2="50" strokeWidth="0.4" strokeDasharray="3 3" />
      <line x1="50" y1="20" x2="50" y2="80" strokeWidth="0.4" strokeDasharray="3 3" />
    </svg>
  );
};

export default function ProjectsSection() {
  const [filter, setFilter] = useState<"all" | "originals" | "forks">("all");
  const [projects, setProjects] = useState<Project[]>(GITHUB_FALLBACK_PROJECTS);
  const [activeProject, setActiveProject] = useState<Project | null>(GITHUB_FALLBACK_PROJECTS[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  // Fetch repositories dynamically from GitHub API
  useEffect(() => {
    let active = true;
    
    async function fetchGitHubRepos() {
      setIsLoading(true);
      try {
        const response = await fetch("https://api.github.com/users/AAB-I-XES/repos?sort=pushed&per_page=30");
        if (!response.ok) {
          throw new Error(`GitHub API returned status: ${response.status}`);
        }
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error("Invalid GitHub API response payload");
        }

        // Map GitHub payload to high-fidelity Project type
        const mappedProjects: Project[] = data
          .filter((repo: any) => repo.name.toLowerCase() !== "about")
          .map((repo: any, index: number) => {
          const isFork = repo.fork;
          const createdYear = repo.created_at ? new Date(repo.created_at).getFullYear().toString() : "2026";
          
          // Generate a deterministic aesthetic layout index for coloring
          const colorIndex = index % 4;
          const colors: Array<'pink' | 'beige' | 'white' | 'dark'> = ["pink", "beige", "white", "dark"];
          const accentColors = ["#ffd6e0", "#E6DFD3", "#FFFFFF", "#111111"];
          
          // Structure cleaner descriptive metrics
          let refinedCategory = repo.language ? `${repo.language} Repository` : "Open Source Repo";
          if (isFork) refinedCategory += " (Fork)";
          
          return {
            id: repo.name.toLowerCase(),
            title: repo.name,
            category: refinedCategory,
            description: repo.description || `An open-source repository hosting the ${repo.name} codebase. Cultivated and maintained publicly on GitHub.`,
            tags: repo.topics && repo.topics.length > 0 
              ? repo.topics 
              : [repo.language || "Software", isFork ? "Forked" : "Original", "GitHub"],
            role: isFork ? "Contributor (Forked)" : "Creator & Maintainer",
            year: createdYear,
            color: colors[colorIndex],
            accentColor: accentColors[colorIndex],
            isFeatured: !isFork && (repo.stargazers_count > 0 || index < 3),
            htmlUrl: repo.html_url,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            isFork: isFork,
          };
        });

        if (active) {
          // Sort to prioritize their original creations first, then forks
          const sortedProjects = [...mappedProjects].sort((a, b) => {
            if (a.isFork === b.isFork) {
              return (b.stars || 0) - (a.stars || 0); // then by stars
            }
            return a.isFork ? 1 : -1; // original first
          });

          setProjects(sortedProjects);
          setActiveProject(sortedProjects[0] || null);
          setIsUsingFallback(false);
        }
      } catch (err) {
        console.warn("GitHub dynamic fetch failed, applying rich backup profile: ", err);
        if (active) {
          setProjects(GITHUB_FALLBACK_PROJECTS);
          setActiveProject(GITHUB_FALLBACK_PROJECTS[0]);
          setIsUsingFallback(true);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    fetchGitHubRepos();
    return () => {
      active = false;
    };
  }, []);

  // Filtering repositories based on selection
  const filteredProjects = projects.filter((proj) => {
    if (filter === "originals") return !proj.isFork;
    if (filter === "forks") return proj.isFork;
    return true;
  });

  return (
    <section
      id="projects"
      className="min-h-screen w-full relative py-20 px-6 md:px-12 bg-[#fcebeb] border-t border-[#141414]/10 overflow-hidden"
    >
      {/* Background drafting lines */}
      <div className="absolute inset-0 sketch-grid-dark opacity-10 pointer-events-none" />

      {/* Header Container */}
      <div className="max-w-7xl mx-auto w-full mb-12 flex flex-col md:flex-row justify-between md:items-center border-b border-[#141414]/10 pb-5 gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#141414]/50 font-bold uppercase tracking-wider">
              04 / GALLERY
            </span>
            <span className="font-display font-black text-lg tracking-wider text-[#141414] uppercase">
              GITHUB ARCHIVES
            </span>
          </div>
          {isUsingFallback && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#141414]/5 text-[#141414]/60 font-mono text-[9px] font-bold border border-[#141414]/10 self-start sm:self-auto uppercase">
              Offline Spec Cached
            </span>
          )}
        </div>

        {/* Dynamic Filter Switcher Controls */}
        <div className="flex items-center gap-1 bg-[#f5f2ed] p-1 border border-[#141414]/15 rounded-full self-start md:self-auto shadow-xs">
          <button
            onClick={() => {
              setFilter("all");
              // Safely set first filtered item active
              const firstFiltered = projects[0];
              if (firstFiltered) setActiveProject(firstFiltered);
            }}
            className={`px-4 py-1.5 rounded-full font-mono text-[10px] sm:text-xs cursor-pointer transition-all ${
              filter === "all"
                ? "bg-[#141414] text-[#f5f2ed] font-bold"
                : "text-[#141414]/60 hover:text-[#141414]"
            }`}
          >
            All Repos ({projects.length})
          </button>
          <button
            onClick={() => {
              setFilter("originals");
              const firstFiltered = projects.find(p => !p.isFork);
              if (firstFiltered) setActiveProject(firstFiltered);
            }}
            className={`px-4 py-1.5 rounded-full font-mono text-[10px] sm:text-xs cursor-pointer transition-all ${
              filter === "originals"
                ? "bg-[#141414] text-[#f5f2ed] font-bold"
                : "text-[#141414]/60 hover:text-[#141414]"
            }`}
          >
            Originals ({projects.filter(p => !p.isFork).length})
          </button>
          <button
            onClick={() => {
              setFilter("forks");
              const firstFiltered = projects.find(p => p.isFork);
              if (firstFiltered) setActiveProject(firstFiltered);
            }}
            className={`px-4 py-1.5 rounded-full font-mono text-[10px] sm:text-xs cursor-pointer transition-all ${
              filter === "forks"
                ? "bg-[#141414] text-[#f5f2ed] font-bold"
                : "text-[#141414]/60 hover:text-[#141414]"
            }`}
          >
            Forks ({projects.filter(p => p.isFork).length})
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        
        {/* LEFT COLUMN: LIST OF DYNAMIC GITHUB ARCHIVE FOLDERS */}
        <div className="lg:col-span-5 space-y-4">
          <div className="font-mono text-[9px] tracking-widest text-[#141414]/50 uppercase pb-2 border-b border-[#141414]/5 flex justify-between items-center font-bold">
            <span>REPOSITORY CATALOG</span>
            <span>AAB-I-XES PROFILE</span>
          </div>

          <div className="space-y-3.5 max-h-[580px] overflow-y-auto pr-2 custom-scrollbar">
            {isLoading ? (
              /* High-fidelity architectural loading skeletons */
              [...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-full bg-white/45 border-2 border-dashed border-[#141414]/15 rounded-xl p-4 flex justify-between items-center animate-pulse"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg border border-[#141414]/10 bg-[#f5f2ed]/50 flex items-center justify-center shrink-0">
                      <RefreshCw className="w-4 h-4 text-[#141414]/20 animate-spin" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-[#141414]/10 rounded" />
                      <div className="h-2 w-20 bg-[#141414]/5 rounded" />
                    </div>
                  </div>
                  <div className="h-4 w-4 bg-[#141414]/10 rounded" />
                </div>
              ))
            ) : filteredProjects.length === 0 ? (
              <div className="border border-dashed border-[#141414]/20 rounded-xl p-8 text-center bg-white/40 font-mono text-xs text-[#141414]/50">
                [ No repositories match this category filter ]
              </div>
            ) : (
              filteredProjects.map((proj) => {
                const isActive = activeProject?.id === proj.id;
                
                // Set layout colors dynamically
                let cardBg = "bg-white";
                if (isActive) {
                  cardBg = proj.color === "pink" ? "bg-[#ffd6e0]" : proj.color === "beige" ? "bg-[#E6DFD3]" : "bg-white";
                }

                return (
                  <button
                    key={proj.id}
                    onClick={() => setActiveProject(proj)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between group ${
                      isActive
                        ? `${cardBg} border-[#141414] shadow-[4px_4px_0px_#141414]`
                        : "bg-white/85 border-[#141414]/10 hover:border-[#141414]/30 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-lg border border-[#141414]/15 bg-[#f5f2ed]/60 flex items-center justify-center text-[#141414]/70 group-hover:rotate-6 transition-transform shrink-0">
                        {proj.isFork ? (
                          <GitFork className="w-4 h-4 text-[#141414]/65" />
                        ) : (
                          <FolderGit2 className="w-4 h-4 text-[#141414]/85" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-display font-black text-sm text-[#141414] tracking-tight truncate max-w-[180px] uppercase">
                            {proj.title}
                          </span>
                          {!proj.isFork && (
                            <Star className="w-3 h-3 text-[#141414] fill-[#141414] shrink-0" />
                          )}
                        </div>
                        <span className="font-mono text-[9px] tracking-wider text-[#141414]/50 uppercase block line-clamp-1 mt-0.5 font-bold">
                          {proj.category}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 text-[#141414]/40 group-hover:translate-x-1 transition-transform shrink-0 ${
                      isActive ? "rotate-90 text-[#141414]" : ""
                    }`} />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILED BLUEPRINT SPECIFICATION DRAWING BOARD */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {activeProject ? (
              <motion.div
                key={activeProject.id}
                initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -30, filter: "blur(6px)" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white border-2 border-[#141414] rounded-2xl shadow-[6px_6px_0px_#141414] overflow-hidden flex flex-col min-h-[500px]"
              >
                {/* Tech Blueprint Header Bar */}
                <div className="bg-[#141414] text-[#f5f2ed] px-6 py-4 flex justify-between items-center font-mono text-[10px] tracking-widest uppercase">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>Blueprint Spec // {activeProject.title}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>{activeProject.year}</span>
                  </div>
                </div>

                <div className="p-6 md:p-8 flex-1 grid grid-cols-1 md:grid-cols-12 gap-8 items-start relative">
                  
                  {/* Schematic Drawing Frame (Top on mobile, Left in subgrid on desktop) */}
                  <div className="md:col-span-5 h-48 md:h-64 border border-[#141414]/10 rounded-xl bg-[#f5f2ed]/50 p-4 relative flex items-center justify-center overflow-hidden">
                    <div className="absolute top-2 left-2.5 font-mono text-[7px] text-[#141414]/30 uppercase font-black">
                      Vector Schematic
                    </div>
                    {/* Render specific procedural SVG blueprint based on project id */}
                    <ProjectSchematic id={activeProject.id} />
                  </div>

                  {/* Blueprint Tech Specs Information (Right in subgrid) */}
                  <div className="md:col-span-7 space-y-6">
                    <div className="space-y-1">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#141414]/50 flex items-center gap-1.5 font-black">
                        <Compass className="w-3.5 h-3.5 text-[#141414]/60" />
                        Repository Core &amp; Scope
                      </span>
                      <h3 className="font-display font-black text-2.5xl text-[#141414] tracking-tight uppercase">
                        {activeProject.title}
                      </h3>
                      <p className="font-mono text-[10px] text-[#141414]/55 uppercase tracking-wider font-bold">
                        {activeProject.category}
                      </p>
                    </div>

                    <p className="font-sans text-xs md:text-sm text-[#141414]/80 leading-relaxed font-semibold select-text">
                      {activeProject.description}
                    </p>

                    {/* Metadata Table Rows */}
                    <div className="border-t border-[#141414]/10 pt-4 space-y-2.5 font-mono text-[10px]">
                      
                      {/* Year Row */}
                      <div className="flex justify-between items-center border-b border-[#141414]/5 pb-1.5 text-[#141414]">
                        <span className="text-[#141414]/50 uppercase flex items-center gap-1.5 font-black">
                          <Calendar className="w-3.5 h-3.5 text-[#141414]/50" /> Year Initiated
                        </span>
                        <span className="font-black">{activeProject.year}</span>
                      </div>

                      {/* Role Row */}
                      <div className="flex justify-between items-center border-b border-[#141414]/5 pb-1.5 text-[#141414]">
                        <span className="text-[#141414]/50 uppercase flex items-center gap-1.5 font-black">
                          <Hammer className="w-3.5 h-3.5 text-[#141414]/50" /> Profile Role
                        </span>
                        <span className="font-black text-right max-w-[150px] sm:max-w-none truncate">
                          {activeProject.role}
                        </span>
                      </div>

                      {/* GitHub Stars & Forks Metrics Row */}
                      <div className="flex justify-between items-center border-b border-[#141414]/5 pb-1.5 text-[#141414]">
                        <span className="text-[#141414]/50 uppercase flex items-center gap-1.5 font-black">
                          <Code2 className="w-3.5 h-3.5 text-[#141414]/50" /> Social Engagement
                        </span>
                        <span className="font-black flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-[#141414]" /> {activeProject.stars ?? 0} Stars
                          </span>
                          <span className="flex items-center gap-1">
                            <GitFork className="w-3 h-3 text-[#141414]" /> {activeProject.forks ?? 0} Forks
                          </span>
                        </span>
                      </div>

                      {/* Tech Stack Elements */}
                      <div className="flex flex-col gap-1.5 pt-1 text-[#141414]">
                        <span className="text-[#141414]/50 uppercase flex items-center gap-1.5 font-black">
                          <Tag className="w-3.5 h-3.5 text-[#141414]/50" /> Stack Components
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {activeProject.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-sm border border-[#141414]/15 bg-[#f5f2ed] text-[#141414]/85 text-[9px] font-black uppercase"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* External Link Action Button */}
                    {activeProject.htmlUrl && (
                      <div className="pt-4 border-t border-[#141414]/5">
                        <a
                          href={activeProject.htmlUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[#141414] bg-white text-[#141414] hover:bg-[#141414] hover:text-[#f5f2ed] shadow-[3px_3px_0px_#141414] hover:shadow-[1px_1px_0px_#141414] hover:translate-x-[2px] hover:translate-y-[2px] font-mono text-[10px] font-black uppercase tracking-wider transition-all w-full md:w-auto"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Inspect on GitHub</span>
                        </a>
                      </div>
                    )}

                  </div>

                </div>
              </motion.div>
            ) : (
              <div className="h-full border-2 border-dashed border-[#141414]/25 rounded-2xl flex items-center justify-center p-8 bg-white/40 min-h-[500px]">
                <span className="font-mono text-xs text-[#141414]/40 tracking-widest uppercase">
                  [ Choose an archive entry to load blueprints ]
                </span>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
