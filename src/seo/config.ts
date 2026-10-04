export const SEO_CONFIG = {
  siteName: "Dibyajyoti Rabha",
  siteUrl: "https://dibrab.vercel.app",
  title: "Dibyajyoti Rabha — Creative Developer & Illustrator",
  description:
    "Dibyajyoti Rabha is a creative developer and illustrator building polished web and mobile experiences, visual interfaces, and open-source projects from Assam, India.",
  locale: "en_IN",
  image: "/og-image.svg",
} as const;

export const SOCIAL_PROFILES = [
  "https://github.com/AAB-I-XES",
  "https://www.linkedin.com/in/dibyajyoti-rabha-250671391",
  "https://x.com/RabhaDibya77515",
] as const;

export const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Dibyajyoti Rabha",
  url: "https://dibrab.vercel.app/",
  description:
    "Creative developer and illustrator portfolio featuring web experiences, mobile interfaces, and software projects.",
  inLanguage: "en-IN",
  publisher: {
    "@type": "Person",
    name: "Dibyajyoti Rabha",
    url: "https://dibrab.vercel.app/",
  },
};

export const PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Dibyajyoti Rabha",
  url: "https://dibrab.vercel.app/",
  sameAs: [...SOCIAL_PROFILES],
  description:
    "Creative developer and illustrator focused on web development, mobile interfaces, and expressive digital products.",
  knowsAbout: [
    "Creative Development",
    "Web Development",
    "React Development",
    "Illustration",
    "Software Development",
  ],
};
