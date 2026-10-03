import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { gsap } from "gsap";
import { ArrowUpRight, GitFork, Github, Star } from "lucide-react";
import type { Project } from "../types";
import BlurText from "./BlurText";
import FlexCarousel from "./FlexCarousel";

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

function ProjectStory({
  project,
  index,
  isLoading,
}: {
  project: Project;
  index: number;
  isLoading: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.article
      animate={prefersReducedMotion ? undefined : {
        y: [0, 8, 0, -7, 0],
        rotateX: [0, -0.6, 0, 0.6, 0],
        rotateY: [0, 0.35, 0, -0.35, 0],
      }}
      transition={prefersReducedMotion ? undefined : {
        duration: 8,
        ease: "easeInOut",
        repeat: Infinity,
      }}
      className="rounded-2xl border border-white/10 bg-[#12151b]/95 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8"
    >
      <div className="mb-8 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
        <span>Chapter {String(index + 1).padStart(2, "0")} / {project.year}</span>
        {project.isFork && <span className="flex items-center gap-1"><GitFork className="h-3 w-3" /> Fork</span>}
      </div>
      <div className="mb-7 block w-full text-left">
        <span className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.19em] text-white/40">
          <span className="h-px w-7 bg-white" />
          {project.isFork ? "Open-source contribution" : "Original project"}
        </span>
        <BlurText
          text={project.title}
          delay={65}
          animateBy="words"
          direction="bottom"
          className="font-display text-4xl leading-[0.98] tracking-tight text-white sm:text-5xl md:text-6xl"
        />
        <span className="mt-5 block font-mono text-[10px] uppercase tracking-[0.13em] text-white/40 sm:text-xs">
          {project.category}
        </span>
      </div>
      <BlurText
        key={`${project.id}-description`}
        text={project.description}
        delay={22}
        stepDuration={0.24}
        animateBy="words"
        direction="bottom"
        className="max-w-2xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8"
      />
      <div className="mt-6 flex flex-wrap gap-2">
        {project.tags.slice(0, 5).map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 font-mono text-[9px] text-white/50 sm:text-[10px]"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-white/40">
          <Star className="h-3.5 w-3.5 text-white/75" /> {project.stars ?? 0}
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-white/40">
          <GitFork className="h-3.5 w-3.5 text-white/55" /> {project.forks ?? 0}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/35">
          {project.role}
        </span>
      </div>
      <div className="mt-7 flex flex-wrap items-center gap-3">
        {project.htmlUrl && (
          <a
            href={project.htmlUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-semibold text-black transition hover:bg-white/80"
          >
            <Github className="h-4 w-4" />
            Explore project
            <ArrowUpRight className="h-4 w-4" />
          </a>
        )}
        {isLoading && (
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/30">
            Syncing GitHub details
          </span>
        )}
      </div>
    </motion.article>
  );
}

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const storyTransitionRef = useRef<HTMLDivElement>(null);
  const carouselTransitionRef = useRef<HTMLDivElement>(null);
  const previousProjectIdRef = useRef<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS);
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
  const activeProject = filteredProjects[activeIndex] ?? filteredProjects[0] ?? null;
  const carouselItems = useMemo(
    () => filteredProjects.map((project) => ({
      src: getPreviewSources(project).src,
      alt: `${project.title} project preview`,
      title: project.title,
      subtitle: project.category,
    })),
    [filteredProjects],
  );

  useLayoutEffect(() => {
    if (!activeProject || previousProjectIdRef.current === activeProject.id) return;

    previousProjectIdRef.current = activeProject.id;
    const targets = [storyTransitionRef.current, carouselTransitionRef.current].filter(
      (target): target is HTMLDivElement => target !== null,
    );
    if (prefersReducedMotion || targets.length === 0) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        targets,
        { autoAlpha: 0.35, y: 22, filter: "blur(8px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.06,
          overwrite: "auto",
        },
      );
    }, sectionRef);

    return () => context.revert();
  }, [activeProject, prefersReducedMotion]);

  const chooseFilter = (nextFilter: ProjectFilter) => {
    setFilter(nextFilter);
    setActiveIndex(0);
  };

  const selectProject = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative isolate w-full overflow-hidden border-t border-white/10 bg-[#0b0d10] px-6 pt-24 pb-0 text-[#f3f3ee] md:px-12 md:pt-28"
    >
      <div className="pointer-events-none absolute -right-44 top-0 h-[34rem] w-[34rem] rounded-full bg-white/[0.045] blur-[140px]" />
      <div className="relative mx-auto mb-10 flex w-full max-w-7xl flex-col justify-between gap-8 border-b border-white/10 pb-8 md:flex-row md:items-end">
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

      {filteredProjects.length > 0 ? (
        <div className="relative mx-auto w-full max-w-7xl">
          <div ref={carouselTransitionRef} className="rounded-2xl border border-white/10 bg-white/[0.015]">
            <FlexCarousel
              items={carouselItems}
              preset="liquid"
              intro="rise"
              fit="landscape"
              cardHeight={0.48}
              gap={18}
              radius={12}
              squeeze={0.12}
              dispersion={0.04}
              followCursor
              focusOnClick
              captions
              onChange={selectProject}
              className="text-white"
              style={{ height: "min(64vh, 620px)", minHeight: "360px" }}
            />
          </div>

          {isUsingFallback && (
            <p className="mt-4 text-center font-mono text-[9px] uppercase tracking-[0.13em] text-white/30">
              Showing cached project archive
            </p>
          )}

          {activeProject && (
            <div ref={storyTransitionRef} className="mx-auto mt-8 max-w-3xl">
              <ProjectStory
                project={activeProject}
                index={activeIndex}
                isLoading={isLoading}
              />
            </div>
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
