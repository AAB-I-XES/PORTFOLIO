import { Project, SkillCategory, JourneyMilestone } from "./types";

export const BIO_SUMMARY = {
  name: "DIBYAJYOTI RABHA",
  title: "Creative Developer & Illustrator",
  tagline: "Merging procedural logic with hand-drawn art to build tactile, soulful digital experiences.",
  intro: "I am a software developer with a deep, consuming passion for creative design, vector graphics, and digital illustration. My practice sits at the fragile intersection of engineering and art. I don't just write functional code; I compose interactive canvases and design expressive, responsive layouts that feel alive.",
  detailedBio: "Growing up fascinated by both comic-book sketchbooks and the magic of programming, I realized that modern browsers are the ultimate canvas. I specialize in building ultra-responsive web applications, native mobile frameworks, and interactive vector tools. From robust React structures to performance-oriented C++ engines, every line is crafted with structural intent and meticulous attention to layout, typography, and motion choreography."
};

export const PROJECTS_DATA: Project[] = [
  {
    id: "aetheria-studio",
    title: "Aetheria Interactive",
    category: "Web Development / Creative Illustration",
    description: "An elegant interactive web gallery showcasing hand-drawn vector illustrations paired with custom responsive layout grids. Designed to feel like a high-end editorial publication that reacts dynamically to scrolling gestures.",
    tags: ["React", "HTML5 Canvas", "Tailwind CSS", "GSAP ScrollTrigger"],
    role: "Lead Creative Technologist & Illustrator",
    year: "2026",
    color: "pink",
    accentColor: "#FADADD",
    isFeatured: true
  },
  {
    id: "kroma-sketch",
    title: "Kroma Sketch Mobile",
    category: "Mobile Application / UX Design",
    description: "A minimal, pressure-sensitive sketching and vector pathing mobile client built for digital artists. Designed with an ultra-clean UI that maximizes drawing surface and features smooth brush engines.",
    tags: ["React Native", "Javascript", "Skia Graphics Engine", "SVG Pathing"],
    role: "Mobile Architect & Product Designer",
    year: "2025",
    color: "beige",
    accentColor: "#E6DFD3",
    isFeatured: true
  },
  {
    id: "aurora-engine",
    title: "Aurora Physics Renderer",
    category: "Systems Programming / Graphic Computing",
    description: "A lightweight cross-platform graphic and physics particle renderer written from scratch to study complex mathematical structures, procedural mesh generation, and low-level optimization.",
    tags: ["C++", "WebGL Integration", "Linear Algebra", "Procedural Math"],
    role: "Core Software Engineer",
    year: "2025",
    color: "dark",
    accentColor: "#111111",
    isFeatured: true
  },
  {
    id: "vesper-notes",
    title: "Vesper Handwritten Notes",
    category: "Mobile Native Client / Algorithms",
    description: "A native notebook application focusing on low-latency ink tracking, hand-drawn circle recognition, and structured notes organisation using cross-platform native modules.",
    tags: ["Kotlin", "Android SDK", "Jetpack Compose", "Custom Canvas API"],
    role: "Android Developer",
    year: "2024",
    color: "white",
    accentColor: "#FFFFFF",
    isFeatured: false
  },
  {
    id: "doodle-space",
    title: "Doodle Space Collaborative",
    category: "Cross-Platform Application",
    description: "A real-time multiplayer sketching board using vector canvas serialization, letting users co-sketch ideas synchronously. Features a retro-futuristic interface with tactile sound feedback.",
    tags: ["Flutter", "Dart", "Websockets Engine", "Bespoke Illustration Design"],
    role: "Fullstack Engineer",
    year: "2024",
    color: "pink",
    accentColor: "#FADADD",
    isFeatured: false
  }
];

export const SKILLS_CATEGORIES: SkillCategory[] = [
  {
    title: "Artistic Direction & Interfaces",
    description: "The core design principles and languages used to shape the visible layouts, vector graphics, and handcrafted elements.",
    skills: [
      {
        name: "Creative Illustration & Graphic Design",
        level: 5,
        iconName: "Palette",
        description: "Vector drafting, custom layouts, character sketches, and visual balance."
      },
      {
        name: "HTML5 & CSS3 Architecture",
        level: 5,
        iconName: "FileCode",
        description: "Semantic structures, advanced typography systems, fluid grid layouts, and custom animations."
      },
      {
        name: "Modern JavaScript / TS",
        level: 5,
        iconName: "Code2",
        description: "Reactive functional patterns, canvas manipulation, and smooth asynchronous rendering."
      }
    ]
  },
  {
    title: "Frontend & Hybrid Ecosystems",
    description: "Modern frameworks and libraries used to construct scalable interfaces, performant single-page apps, and native apps.",
    skills: [
      {
        name: "React.js Framework",
        level: 5,
        iconName: "Atom",
        description: "Component architecture, performance profiling, and state machines."
      },
      {
        name: "React Native",
        level: 4,
        iconName: "Smartphone",
        description: "Native bridges, fluid gestures, offline state, and cross-platform UX."
      },
      {
        name: "Flutter & Dart",
        level: 4,
        iconName: "Layers",
        description: "Reactive widget trees, hardware-accelerated rendering, and custom paints."
      }
    ]
  },
  {
    title: "Systems & Native Engineering",
    description: "The foundational systems and compiled languages used for high-performance computing, mathematical rendering, and native platforms.",
    skills: [
      {
        name: "Kotlin & Android Native",
        level: 4,
        iconName: "SmartphoneCharging",
        description: "Jetpack Compose, background services, custom drawing canvas APIs, and memory optimization."
      },
      {
        name: "C / C++ Foundations",
        level: 4,
        iconName: "Cpu",
        description: "Resource management, algorithms, memory layouts, and graphics math."
      }
    ]
  }
];

export const JOURNEY_TIMELINE: JourneyMilestone[] = [
  {
    year: "2025 — PRESENT",
    title: "Independent Creative Developer & Illustrator",
    role: "Freelance / Open Source Collaborator",
    description: "Designing bespoke brand websites, drafting vector characters for digital publications, and experimenting with procedural graphics, C++ web assembly, and creative layouts.",
    tags: ["React", "Illustration", "C++ Engine", "GSAP"]
  },
  {
    year: "2024 — 2025",
    title: "Hybrid Mobile Architect",
    role: "Core Technical Engineer",
    description: "Led development on multiple React Native and Flutter projects, integrating drawing layers, drawing stroke predictions, and offline-first reactive persistence models.",
    tags: ["React Native", "Flutter", "Kotlin", "Canvas APIs"]
  },
  {
    year: "2023 — 2024",
    title: "Frontend Engineering Specialist",
    role: "Interactive UI Developer",
    description: "Focused heavily on interactive HTML/CSS/JS features, building editorial interactive platforms, typographic templates, and optimizing web performance for mobile devices.",
    tags: ["Javascript", "HTML/CSS", "Web Animation", "SVG Optimization"]
  }
];
