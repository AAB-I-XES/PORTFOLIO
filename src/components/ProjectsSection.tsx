import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, X } from "lucide-react";
import type { Project } from "../types";
import FlexCarousel from "./FlexCarousel";
import LiquidButton from "./LiquidButton";

const REPOSITORY_IMAGE_ASSETS = {
  ...import.meta.glob<string>("../../assets/[0-9]*.{png,jpg,jpeg,webp}", {
    eager: true,
    query: "?url",
    import: "default",
  }),
  ...import.meta.glob<string>("../../assets/{MESHCONNECT,PX3115,px3115}.{png,jpg,jpeg,webp}", {
    eager: true,
    query: "?url",
    import: "default",
  }),
};

const REPOSITORY_IMAGES = Object.entries(REPOSITORY_IMAGE_ASSETS).reduce<Record<string, string>>((images, [path, src]) => {
  const filename = path.split("/").pop() ?? "";
  const repositoryName = filename.replace(/^\d+_/, "").replace(/\.[^.]+$/, "");
  const key = repositoryName.toLowerCase().replace(/[^a-z0-9]/g, "");
  images[key] = src;
  return images;
}, {});

const REPOSITORY_IMAGE_ALIASES: Record<string, string> = {
  px3115controller: "px3115",
};

type ProjectFilter = "all" | "originals" | "forks";

interface GitHubRepository {
  name: string;
  fork: boolean;
  created_at: string;
  language: string | null;
  description: string | null;
  topics: string[];
  html_url: string;
  homepage: string | null;
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
    accentColor: "#a0a0a0",
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
    accentColor: "#707070",
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
    && (typeof repo.homepage === "string" || repo.homepage === null)
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
    homepage: repo.homepage || undefined,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    isFork,
  };
}

function createProjectPreview(project: Project) {
  const escapeXml = (value: string) => value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
  const title = escapeXml(project.title);
  const category = escapeXml(project.category);
  const tags = project.tags.slice(0, 3).map(escapeXml).join("  /  ");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1440" height="900" viewBox="0 0 1440 900">
      <defs>
        <linearGradient id="screen" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#292929"/>
          <stop offset="1" stop-color="#090909"/>
        </linearGradient>
        <radialGradient id="light">
          <stop stop-color="#ffffff" stop-opacity=".22"/>
          <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1440" height="900" fill="url(#screen)"/>
      <circle cx="1120" cy="160" r="510" fill="url(#light)"/>
      <g fill="none" stroke="#fff" stroke-opacity=".11">
        <path d="M0 180h1440M0 240h1440M0 300h1440M0 360h1440"/>
        <path d="M140 0v900M260 0v900M380 0v900"/>
      </g>
      <text x="110" y="145" fill="#fff" fill-opacity=".54" font-family="monospace" font-size="24" letter-spacing="7">AAB-I-XES  /  PROJECT ARCHIVE</text>
      <path d="M110 205h1220" stroke="#fff" stroke-opacity=".24"/>
      <text x="110" y="430" fill="#fff" font-family="Arial,sans-serif" font-size="94" font-weight="700">${title}</text>
      <text x="114" y="495" fill="#fff" fill-opacity=".62" font-family="monospace" font-size="28">${category}</text>
      <text x="114" y="740" fill="#fff" fill-opacity=".72" font-family="monospace" font-size="25">${tags}</text>
      <text x="114" y="810" fill="#fff" fill-opacity=".38" font-family="monospace" font-size="19">${project.year}  ·  ${project.isFork ? "OPEN SOURCE FORK" : "ORIGINAL PROJECT"}</text>
    </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function getPreviewSources(project: Project) {
  const repositoryName = project.htmlUrl?.split("/").pop() || project.title;
  return {
    src: `https://opengraph.githubassets.com/1/AAB-I-XES/${encodeURIComponent(repositoryName)}`,
    fallbackSrc: createProjectPreview(project),
  };
}

export default function ProjectsSection() {
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedProjectIndex, setExpandedProjectIndex] = useState<number | null>(null);
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
            if (left.isFork === right.isFork) return (right.stars ?? 0) - (left.stars ?? 0);
            return left.isFork ? 1 : -1;
          });

        if (isMounted) {
          setProjects(repositories);
          setActiveIndex(0);
          setIsUsingFallback(false);
        }
      } catch (error) {
        console.warn("Unable to load GitHub repositories; showing the cached project list.", error);
        if (isMounted) {
          setProjects(FALLBACK_PROJECTS);
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
  const carouselItems = useMemo(
    () => filteredProjects.map((project) => {
      const projectKey = project.title.toLowerCase().replace(/[^a-z0-9]/g, "");
      const imageKey = REPOSITORY_IMAGE_ALIASES[projectKey] ?? projectKey;
      return {
        src: REPOSITORY_IMAGES[imageKey] ?? getPreviewSources(project).src,
        alt: `${project.title} project preview`,
        title: project.title,
        subtitle: project.category,
      };
    }),
    [filteredProjects],
  );
  const expandedProject = expandedProjectIndex === null
    ? null
    : filteredProjects[expandedProjectIndex] ?? null;

  const chooseFilter = (nextFilter: ProjectFilter) => {
    setFilter(nextFilter);
    setActiveIndex(0);
    setExpandedProjectIndex(null);
  };

  const selectProject = (index: number) => {
    setActiveIndex(index);
  };
  const openProjectDetails = (index: number) => {
    setExpandedProjectIndex(index);
  };

  return (
    <section
      id="projects"
      className="relative isolate w-full overflow-hidden border-t border-white/10 bg-[#0b0d10] pt-24 pb-0 text-[#f3f3ee] md:pt-28"
    >
      <div className="pointer-events-none absolute -right-44 top-0 h-[34rem] w-[34rem] rounded-full bg-white/[0.045] blur-[140px]" />
      <div className="relative mx-auto mb-10 flex w-full max-w-7xl flex-col justify-between gap-8 border-b border-white/10 px-6 pb-8 md:flex-row md:items-end md:px-12">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-white">
            04 / Selected work
          </span>
          <h2 className="mt-5 font-display text-4xl tracking-tight sm:text-5xl">
            A moving archive of work.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/45">
            Drag, scroll, or focus a project to explore the collection.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {([
            { id: "all", label: "Everything" },
            { id: "originals", label: "Originals" },
            { id: "forks", label: "Forks" },
          ] as { id: ProjectFilter; label: string }[]).map(({ id, label }) => (
            <LiquidButton
              key={id}
              type="button"
              active={filter === id}
              onClick={() => chooseFilter(id)}
              aria-pressed={filter === id}
              className={`rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] transition ${
                filter === id
                  ? "border-white/55 text-white"
                  : "border-white/15 text-white/55 hover:border-white/40 hover:text-white"
              }`}
            >
              {label}
              <span className="ml-2 opacity-60">
                {id === "all"
                  ? projects.length
                  : projects.filter((project) => (id === "forks" ? project.isFork : !project.isFork)).length}
              </span>
            </LiquidButton>
          ))}
        </div>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="relative w-full">
          <div className={`mx-auto grid w-full items-center transition-[grid-template-columns] duration-500 ${expandedProject
            ? "max-w-7xl grid-cols-1 gap-x-7 gap-y-8 px-6 md:px-12 lg:grid-cols-[minmax(13rem,0.82fr)_minmax(0,2.2fr)_minmax(13rem,0.72fr)]"
            : "grid-cols-1"
          }`}>
            <aside className={expandedProject ? "min-w-0 lg:border-r lg:border-white/10 lg:pr-6" : "hidden"}>
              <AnimatePresence mode="wait">
                {expandedProject && (
                  <motion.div
                    key={expandedProject.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/45">
                          {expandedProject.category} / {expandedProject.year}
                        </span>
                        <h3 className="mt-3 break-words font-display text-2xl text-white sm:text-3xl">
                          {expandedProject.title}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setExpandedProjectIndex(null)}
                        aria-label="Close project details"
                        className="grid h-9 w-9 shrink-0 place-items-center border border-white/15 text-white/65 transition hover:border-white hover:text-white"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                    <p className="mt-5 text-sm leading-7 text-white/65">
                      {expandedProject.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {expandedProject.tags.map((tag) => (
                        <span
                          key={tag}
                          className="border border-white/10 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.08em] text-white/55"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </aside>

            <FlexCarousel
              items={carouselItems}
              preset="liquid"
              intro="rise"
              fit="landscape"
              cardHeight={0.58}
              gap={18}
              radius={12}
              squeeze={0.12}
              dispersion={0.04}
              followCursor
              focusOnClick
              captions
              onChange={selectProject}
              onSelect={openProjectDetails}
              onNavigate={() => setExpandedProjectIndex(null)}
              className="min-w-0 text-white"
              style={{ height: "min(72vh, 760px)", minHeight: "380px" }}
            />

            <aside className={expandedProject ? "min-w-0 lg:border-l lg:border-white/10 lg:pl-6" : "hidden"}>
              <AnimatePresence mode="wait">
                {expandedProject && (
                  <motion.div
                    key={expandedProject.id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                      Project links
                    </span>
                    <div className="mt-4 flex flex-col">
                      {expandedProject.homepage && (
                        <a
                          href={expandedProject.homepage}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between border-b border-white/10 py-4 text-sm text-white/75 transition hover:text-white"
                        >
                          Live project
                          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </a>
                      )}
                      {expandedProject.htmlUrl && (
                        <a
                          href={expandedProject.htmlUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between border-b border-white/10 py-4 text-sm text-white/75 transition hover:text-white"
                        >
                          Source repository
                          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </aside>
          </div>

          {isUsingFallback && (
            <p className="mt-4 text-center font-mono text-[9px] uppercase tracking-[0.13em] text-white/30">
              Showing cached project archive
            </p>
          )}

        </div>
      ) : (
        <p className="mx-auto max-w-7xl py-24 text-center text-sm text-white/45">
          {isLoading ? "Loading project stories…" : "No projects in this collection yet."}
        </p>
      )}
    </section>
  );
}
