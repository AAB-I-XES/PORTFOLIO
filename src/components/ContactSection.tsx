import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Mail, MapPin, Send } from "lucide-react";
import SpotlightCard from "./SpotlightCard";

const CONTACT_EMAIL = "rabhadibyajyoti05@gmail.com";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [hasOpenedDraft, setHasOpenedDraft] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = `Portfolio enquiry from ${name.trim()}`;
    const body = `${message.trim()}\n\n— ${name.trim()}\n${email.trim()}`;
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    setHasOpenedDraft(true);
  };

  return (
    <section
      id="contact"
      className="relative isolate w-full overflow-hidden border-t border-white/10 bg-[#101318] px-6 pt-0 pb-24 text-[#f3f3ee] md:px-12"
    >
      <div className="pointer-events-none absolute -bottom-48 left-1/3 h-[30rem] w-[30rem] rounded-full bg-white/[0.055] blur-[130px]" />
      <div className="relative mx-auto mb-16 flex w-full max-w-7xl items-end justify-between border-b border-white/10 pb-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-white">
            05 / Contact
          </span>
          <h2 className="mt-4 max-w-2xl font-display text-4xl tracking-tight sm:text-5xl">
            Good things start with hello.
          </h2>
        </div>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-white/35 md:block">
          Open to select collaborations
        </span>
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="space-y-10 lg:col-span-5">
          <p className="max-w-lg text-lg leading-8 text-white/60">
            Have a thoughtful project, a creative idea, or a question? I’m available for select
            freelance and collaboration opportunities.
          </p>

          <SpotlightCard className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
            <span className="relative z-10 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
              Direct line
            </span>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="relative z-10 mt-3 flex flex-wrap items-center gap-2 text-lg text-white transition hover:text-white/70 sm:text-xl"
            >
              <Mail className="h-5 w-5 text-white" aria-hidden="true" />
              {CONTACT_EMAIL}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <div className="relative z-10 mt-7 flex items-center gap-3 border-t border-white/10 pt-5 text-sm text-white/50">
              <MapPin className="h-4 w-4 text-white" aria-hidden="true" />
              Guwahati, Assam, India
            </div>
          </SpotlightCard>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://github.com/AAB-I-XES"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-xs text-white/60 transition hover:border-white hover:bg-white hover:text-black"
            >
              GitHub <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://www.linkedin.com/in/dibyajyoti-rabha-250671391"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-xs text-white/60 transition hover:border-white hover:bg-white hover:text-black"
            >
              LinkedIn <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <SpotlightCard className="rounded-2xl border border-white/10 bg-[#171a20] p-6 sm:p-8 lg:col-span-7">
          <form onSubmit={handleSubmit} className="relative z-10 space-y-7">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="contact-name" className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
                  Your name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={100}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Name"
                  className="w-full rounded-xl border border-white/10 bg-[#0d0f13] px-4 py-3.5 text-sm text-white placeholder:text-white/25 focus:border-white/60 focus:outline-none focus:ring-2 focus:ring-white/15"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="contact-email" className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
                  Email address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-[#0d0f13] px-4 py-3.5 text-sm text-white placeholder:text-white/25 focus:border-white/60 focus:outline-none focus:ring-2 focus:ring-white/15"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="contact-message" className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
                What’s on your mind?
              </label>
              <textarea
                id="contact-message"
                rows={6}
                required
                maxLength={5000}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Tell me a little about it..."
                className="w-full resize-y rounded-xl border border-white/10 bg-[#0d0f13] px-4 py-3.5 text-sm leading-6 text-white placeholder:text-white/25 focus:border-white/60 focus:outline-none focus:ring-2 focus:ring-white/15"
              />
            </div>
            <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center">
              <p className="max-w-sm text-xs leading-5 text-white/35">
                This opens a pre-filled draft in your email app. Your message is not stored on this site.
              </p>
              <button
                type="submit"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-semibold text-[#11140c] transition hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#171a20]"
              >
                {hasOpenedDraft ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                {hasOpenedDraft ? "Draft requested" : "Compose email"}
              </button>
            </div>
            {hasOpenedDraft && (
              <p role="status" className="text-xs text-white">
                Your email app should open with the message ready. If it didn’t, email {CONTACT_EMAIL}.
              </p>
            )}
          </form>
        </SpotlightCard>
      </div>
    </section>
  );
}
