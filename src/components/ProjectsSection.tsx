import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  GitFork,
  Github,
  Star,
} from "lucide-react";
import type { Project } from "../types";
import FlyingPosters from "./FlyingPosters";

type ProjectFilter = "all" | "originals" | "forks";

interface GitHubRepository {
  name: string;
  fork: boolean;
  created_at: string;
  language: string | null;
  description: string | null;
  topics: string[];
  html_url: string;
  stargazers_count: number;
  forks_count: number;
}

const FALLBACK_PROJECTS: Project[] = [
  {
    id: "harmonic",
    title: "HARMONIC",
    category: "Kotlin / Android",
    description: "An open-source music streaming and audio management application built natively with Kotlin.",
    tags: ["Kotlin", "Android", "Audio", "ExoPlayer"],
    role: "Creator & Maintainer",
    year: "2026",
    color: "pink",
    accentColor: "#ffffff",
    isFeatured: true,
    htmlUrl: "https://github.com/AAB-I-XES/HARMONIC",
    stars: 1,
    forks: 0,
    isFork: false,
  },
  {
    id: "piannaa",
    title: "piannaa",
    category: "TypeScript / Audio",
    description: "An interactive digital piano interface built with lightweight audio synthesis and a visual-first layout.",
    tags: ["TypeScript", "Web Audio API", "SVG"],
    role: "Creator & Maintainer",
    year: "2026",
    color: "beige",
    accentColor: "#b8b8b8",
    isFeatured: true,
    htmlUrl: "https://github.com/AAB-I-XES/piannaa",
    stars: 0,
    forks: 0,
    isFork: false,
  },
  {
    id: "compose-multiplatform",
    title: "compose-multiplatform",
    category: "Kotlin / UI framework",
    description: "A development fork for exploring declarative UI across Android, iOS, desktop, and web.",
    tags: ["Kotlin", "Compose", "Multiplatform"],
    role: "Contributor · Fork",
    year: "2026",
    color: "white",
    accentColor: "#b8b8b8",
    htmlUrl: "https://github.com/AAB-I-XES/compose-multiplatform",
    stars: 0,
    forks: 0,
    isFork: true,
  },
  {
    id: "linux",
    title: "linux",
    category: "C / Systems",
    description: "A personal development environment for exploring systems programming, drivers, and kernel mechanics.",
    tags: ["C", "Linux", "Systems"],
    role: "Contributor · Fork",
    year: "2026",
    color: "dark",
    accentColor: "#ffffff",
    htmlUrl: "https://github.com/AAB-I-XES/linux",
    stars: 0,
    forks: 0,
    isFork: true,
  },
  {
    id: "nowinandroid",
    title: "nowinandroid",
    category: "Kotlin / Android",
    description: "A fork of Google's Android sample app for studying modern development practices and Compose UI.",
    tags: ["Kotlin", "Android", "Compose", "Hilt"],
    role: "Contributor · Fork",
    year: "2026",
    color: "pink",
    accentColor: "#b8b8b8",
    htmlUrl: "https://github.com/AAB-I-XES/nowinandroid",
    stars: 0,
    forks: 0,
    isFork: true,
  },
];

function isRepository(value: unknown): value is GitHubRepository {
  if (!value || typeof value !== "object") return false;
  const repo = value as Record<string, unknown>;
  return typeof repo.name === "string"
    && typeof repo.fork === "boolean"
    && typeof repo.created_at === "string"
    && (typeof repo.language === "string" || repo.language === null)
    && (typeof repo.description === "string" || repo.description === null)
    && typeof repo.html_url === "string"
    && typeof repo.stargazers_count === "number"
    && typeof repo.forks_count === "number"
    && Array.isArray(repo.topics)
    && repo.topics.every((topic) => typeof topic === "string");
}

function mapRepository(repo: GitHubRepository, index: number): Project {
  const isFork = repo.fork;
  const accentColors = ["#ffffff", "#d0d0d0", "#a0a0a0", "#707070"];
  const category = repo.language ? `${repo.language} repository` : "Open-source repository";

  return {
    id: repo.name.toLowerCase(),
    title: repo.name,
    category: isFork ? `${category} · Fork` : category,
    description: repo.description || `Open-source work from the ${repo.name} repository.`,
    tags: repo.topics.length > 0
      ? repo.topics
      : [repo.language || "Software", isFork ? "Fork" : "Original"],
    role: isFork ? "Contributor · Fork" : "Creator & Maintainer",
    year: new Date(repo.created_at).getFullYear().toString(),
    color: ["pink", "beige", "white", "dark"][index % 4] as Project["color"],
    accentColor: accentColors[index % accentColors.length] ?? "#ffffff",
    isFeatured: !isFork && repo.stargazers_count > 0,
    htmlUrl: repo.html_url,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    isFork,
  };
}

function createPosterFallback(project: Project) {
  const title = project.title.replace(/[<>&"']/g, "");
  const category = project.category.replace(/[<>&"']/g, "");
  const color = /^#[\da-f]{6}$/i.test(project.accentColor) ? project.accentColor : "#ffffff";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="880" viewBox="0 0 640 880">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#252525"/>
          <stop offset="1" stop-color="#0b0b0b"/>
        </linearGradient>
        <radialGradient id="glow">
          <stop stop-color="${color}" stop-opacity=".42"/>
          <stop offset="1" stop-color="${color}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="640" height="880" fill="url(#bg)"/>
      <circle cx="490" cy="180" r="290" fill="url(#glow)"/>
      <path d="M0 560 640 300M0 650 640 390M0 740 640 480" stroke="#fff" stroke-opacity=".12"/>
      <text x="52" y="88" fill="${color}" font-family="monospace" font-size="18" letter-spacing="5">AAB-I-XES / OPEN SOURCE</text>
      <text x="52" y="660" fill="#fff" font-family="sans-serif" font-size="54" font-weight="700">${title}</text>
      <text x="54" y="710" fill="#fff" fill-opacity=".6" font-family="monospace" font-size="20">${category}</text>
      <text x="54" y="822" fill="#fff" fill-opacity=".45" font-family="monospace" font-size="16">PROJECT ARCHIVE • 2026</text>
    </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export default function ProjectsSection() {
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS);
  const [activeProject, setActiveProject] = useState<Project | null>(FALLBACK_PROJECTS[0] ?? null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProjects() {
      try {
        const response = await fetch(
          "https://api.github.com/users/AAB-I-XES/repos?sort=pushed&per_page=30",
        );
        if (!response.ok) {
          throw new Error(`GitHub API returned status ${response.status}`);
        }
        const payload: unknown = await response.json();
        if (!Array.isArray(payload)) {
          throw new Error("GitHub API returned an invalid repository list");
        }

        const validRepositories = payload.filter(isRepository);
        if (validRepositories.length !== payload.length) {
          throw new Error("GitHub API returned an invalid repository entry");
        }

        const repositories = validRepositories
          .filter((repo) => repo.name.toLowerCase() !== "about")
          .map(mapRepository)
          .sort((left, right) => {
            if (left.isFork !== right.isFork) return left.isFork ? 1 : -1;
            return (right.stars ?? 0) - (left.stars ?? 0);
          });

        if (isMounted) {
          setProjects(repositories);
          setActiveProject(repositories[0] ?? null);
          setActiveIndex(0);
          setIsUsingFallback(false);
        }
      } catch (error) {
        console.warn("Unable to load GitHub repositories; showing the cached project list.", error);
        if (isMounted) {
          setProjects(FALLBACK_PROJECTS);
          setActiveProject(FALLBACK_PROJECTS[0] ?? null);
          setActiveIndex(0);
          setIsUsingFallback(true);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProjects = useMemo(
    () => projects.filter((project) => {
      if (filter === "originals") return !project.isFork;
      if (filter === "forks") return project.isFork;
      return true;
    }),
    [filter, projects],
  );
  const posterItems = useMemo(
    () => filteredProjects.map((project) => {
      const repositoryName = project.htmlUrl?.split("/").pop() || project.title;
      return `https://opengraph.githubassets.com/1/AAB-I-XES/${encodeURIComponent(repositoryName)}`;
    }),
    [filteredProjects],
  );
  const posterFallbacks = useMemo(
    () => filteredProjects.map(createPosterFallback),
    [filteredProjects],
  );

  const chooseFilter = (nextFilter: ProjectFilter) => {
    setFilter(nextFilter);
    const nextProjects = projects.filter((project) => {
      if (nextFilter === "originals") return !project.isFork;
      if (nextFilter === "forks") return project.isFork;
      return true;
    });
    setActiveProject(nextProjects[0] ?? null);
    setActiveIndex(0);
  };

  const selectProject = (index: number) => {
    const project = filteredProjects[index];
    if (!project) return;
    setActiveIndex(index);
    setActiveProject(project);
  };

  const filters: { id: ProjectFilter; label: string }[] = [
    { id: "all", label: "Everything" },
    { id: "originals", label: "Originals" },
    { id: "forks", label: "Forks" },
  ];

  return (
    <section
      id="projects"
      className="relative isolate w-full overflow-hidden border-t border-white/10 bg-[#0b0d10] px-6 py-28 text-[#f3f3ee] md:px-12 md:py-32"
    >
      <div className="pointer-events-none absolute -right-44 top-0 h-[34rem] w-[34rem] rounded-full bg-white/[0.045] blur-[140px]" />
      <div className="relative mx-auto mb-16 flex w-full max-w-7xl flex-col justify-between gap-8 border-b border-white/10 pb-8 md:flex-row md:items-end">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-white">
            04 / Selected work
          </span>
          <h2 className="mt-5 font-display text-4xl tracking-tight sm:text-5xl">
            Built, learned, shared.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/45">
            A live window into my public GitHub work — original projects alongside repositories
            I’m learning from and contributing to.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => chooseFilter(id)}
              aria-pressed={filter === id}
              className={`rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] transition ${
                filter === id
                  ? "border-white bg-white text-[#11140c]"
                  : "border-white/15 text-white/55 hover:border-white/40 hover:text-white"
              }`}
            >
              {label}
              <span className="ml-2 opacity-60">
                {id === "all"
                  ? projects.length
                  : projects.filter((project) => (id === "forks" ? project.isFork : !project.isFork)).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl gap-8 overflow-hidden rounded-[2rem] border border-white/10 bg-[#12151b] lg:min-h-[44rem] lg:grid-cols-2">
        <div className="relative z-10 flex flex-col justify-between p-7 sm:p-12 lg:p-14">
          {activeProject ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.id}
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -18, filter: "blur(6px)" }}
                transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <div className="mb-14 flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                    <span className={`h-2 w-2 rounded-full ${isUsingFallback ? "bg-white/45" : "animate-pulse bg-white"}`} />
                    {isLoading ? "Syncing archive" : isUsingFallback ? "Cached archive" : "Live from GitHub"}
                  </span>
                  <span className="font-mono text-xs text-white/35">
                    {String(activeIndex + 1).padStart(2, "0")} / {String(filteredProjects.length).padStart(2, "0")}
                  </span>
                </div>

                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white">
                  {activeProject.isFork ? "Open source / Fork" : "Open source / Original"}
                </span>
                <h3 className="mt-7 break-words font-display text-4xl leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {activeProject.title}
                </h3>
                <p className="mt-5 font-mono text-xs uppercase tracking-[0.12em] text-white/40">
                  {activeProject.category} <span className="px-1 text-white/20">/</span> {activeProject.year}
                </p>
                <p className="mt-10 max-w-lg text-sm leading-8 text-white/60 sm:text-base">
                  {activeProject.description}
                </p>
                <div className="mt-8 flex flex-wrap gap-2.5">
                  {activeProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 font-mono text-[10px] text-white/55"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="grid min-h-72 place-items-center text-center text-sm text-white/45">
              {isLoading ? "Loading projects…" : "No projects available for this filter."}
            </div>
          )}

          <div className="mt-14 border-t border-white/10 pt-6">
            <div className="mb-7 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 font-mono text-xs text-white/45">
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-white" />
                  {activeProject?.stars ?? 0}
                </span>
                <span className="flex items-center gap-1.5">
                  <GitFork className="h-4 w-4 text-white/60" />
                  {activeProject?.forks ?? 0}
                </span>
                <span>{activeProject?.role}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous project"
                  disabled={filteredProjects.length < 2}
                  onClick={() => selectProject((activeIndex - 1 + filteredProjects.length) % filteredProjects.length)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition hover:border-white hover:bg-white hover:text-black disabled:opacity-30"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next project"
                  disabled={filteredProjects.length < 2}
                  onClick={() => selectProject((activeIndex + 1) % filteredProjects.length)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition hover:border-white hover:bg-white hover:text-black disabled:opacity-30"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            {activeProject?.htmlUrl && (
              <a
                href={activeProject.htmlUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-semibold text-[#11140c] transition hover:bg-white/80"
              >
                <Github className="h-4 w-4" />
                Explore repository
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div className="relative min-h-[34rem] overflow-hidden bg-[radial-gradient(ellipse_at_50%_45%,rgba(255,255,255,0.09),transparent_55%)] lg:min-h-[44rem]">
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-[#12151b] via-transparent to-transparent lg:w-1/3" />
          <div className="absolute inset-0 px-3 sm:px-8">
            {posterItems.length > 0 && (
              <FlyingPosters
                items={posterItems}
                fallbacks={posterFallbacks}
                activeIndex={activeIndex}
                onActiveIndexChange={selectProject}
                planeWidth={360}
                planeHeight={430}
                gap={64}
                distortion={2.2}
                scrollEase={0.08}
                cameraFov={42}
                cameraZ={22}
              />
            )}
          </div>
          <div className="pointer-events-none absolute bottom-6 left-0 right-0 z-20 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
            <ArrowDown className="h-3.5 w-3.5 text-white" />
            Scroll here to explore
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 grid w-full max-w-7xl grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-10 lg:grid-cols-5 lg:gap-4">
        {filteredProjects.map((project, index) => (
          <button
            key={project.id}
            type="button"
            onClick={() => selectProject(index)}
            aria-pressed={index === activeIndex}
            className={`group flex min-w-0 items-center justify-between gap-2 rounded-xl border px-3 py-3 text-left transition sm:px-4 ${
              index === activeIndex
                ? "border-white/40 bg-white/[0.08]"
                : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
            }`}
          >
            <span className="min-w-0">
              <span className="block truncate font-mono text-[9px] text-white/35">0{index + 1}</span>
              <span className={`mt-1 block truncate text-xs ${index === activeIndex ? "text-white" : "text-white/55 group-hover:text-white"}`}>
                {project.title}
              </span>
            </span>
            <ArrowUpRight className={`h-3.5 w-3.5 shrink-0 ${index === activeIndex ? "text-white" : "text-white/20"}`} />
          </button>
        ))}
      </div>
    </section>
  );
}
