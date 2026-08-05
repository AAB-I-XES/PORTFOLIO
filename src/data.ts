import { Project, SkillCategory, JourneyMilestone } from "./types";

export const BIO_SUMMARY = {
  name: "DIBYAJYOTI RABHA",
  title: "Creative Developer & Illustrator",
  tagline: "Merging code, motion, and hand-drawn illustration into tactile digital experiences.",
  availability: "Available for select freelance and collaboration opportunities.",
  intro: "I’m an Electronics and Communication Engineering student at Assam Skill University, Mangaldai, Assam, with a growing focus on building meaningful digital products. My work spans web development, Android development, and creative interface design, with a strong interest in responsive experiences, polished UI systems, and user-centered product thinking.",
  detailedBio: "I enjoy turning ideas into practical, visually expressive applications across web and mobile platforms. While I work confidently with modern frontend workflows, I am also actively developing Android experiences using Kotlin and React Native, with an emphasis on clean architecture, intuitive UX, and polished interaction design. My practice brings together engineering discipline, creative illustration, and a product mindset rooted in both function and detail."
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
        level: 3,
        iconName: "FileCode",
        description: "Semantic structures, advanced typography systems, fluid grid layouts, and custom animations."
      },
      {
        name: "Modern JavaScript / TS",
        level: 3,
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
        level: 2,
        iconName: "Atom",
        description: "Component architecture, performance profiling, and state machines."
      },
      {
        name: "React Native",
        level: 2,
        iconName: "Smartphone",
        description: "Native bridges, fluid gestures, offline state, and cross-platform UX."
      },
      {
        name: "Flutter & Dart",
        level: 0,
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
        level: 1,
        iconName: "SmartphoneCharging",
        description: "Jetpack Compose, background services, custom drawing canvas APIs, and memory optimization."
      },
      {
        name: "C / C++ Foundations",
        level: 2,
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
