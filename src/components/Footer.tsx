import { ArrowUp, MoveUpRight } from "lucide-react";

interface FooterProps {
  onScrollToTop: () => void;
}

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/AAB-I-XES" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/dibyajyoti-rabha-250671391" },
  { label: "X", href: "https://x.com/RabhaDibya77515" },
];

export default function Footer({ onScrollToTop }: FooterProps) {
  return (
    <footer className="relative w-full overflow-hidden border-t border-white/10 bg-[#08090b] px-6 py-16 text-[#f3f3ee] md:px-12 md:py-20">
      <div className="pointer-events-none absolute -right-36 -top-48 h-96 w-96 rounded-full bg-white/[0.045] blur-[120px]" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-16">
        <div className="flex flex-col justify-between gap-12 md:flex-row md:items-end">
          <div className="max-w-xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white">
              Dibyajyoti Rabha / Creative developer
            </span>
            <p className="mt-5 font-display text-2xl leading-relaxed text-white/75 sm:text-3xl">
              Engineering, illustration, and thoughtful details — brought together on the web.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-white/50 transition hover:text-white"
              >
                {link.label}
                <MoveUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ))}
            <button
              type="button"
              onClick={onScrollToTop}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-xs text-white/70 transition hover:border-white hover:bg-white hover:text-black"
            >
              Back to top
              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 border-t border-white/10 pt-7 font-mono text-[10px] uppercase tracking-[0.12em] text-white/35 sm:flex-row">
          <span>© 2026 Dibyajyoti Rabha</span>
          <span>Made in Guwahati, Assam</span>
        </div>
      </div>
    </footer>
  );
}
