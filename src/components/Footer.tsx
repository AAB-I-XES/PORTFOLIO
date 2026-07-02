import React from "react";
import { Sparkles, ArrowUp } from "lucide-react";

interface FooterProps {
  onScrollToTop: () => void;
}

export default function Footer({ onScrollToTop }: FooterProps) {
  return (
    <footer className="w-full bg-[#141414] text-[#f5f2ed] py-16 px-6 md:px-12 relative overflow-hidden select-none border-t-4 border-[#ffd6e0]">
      {/* Background visual detail */}
      <div className="absolute inset-0 sketch-grid opacity-5 pointer-events-none" />
      
      {/* Pink decorative glow */}
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#ffd6e0]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full flex flex-col gap-12 relative z-10">
        
        {/* Main upper footer flex row */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          
          {/* Logo & Manifesto column */}
          <div className="space-y-4 max-w-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#fcebeb] text-[#141414] flex items-center justify-center font-display font-black text-xs">
                D
              </div>
              <span className="font-display font-black text-sm tracking-widest text-white uppercase">
                DIBYAJYOTI RABHA
              </span>
            </div>
            <p className="font-sans text-xs text-[#f5f2ed]/65 leading-relaxed font-semibold">
              Designing type-safe architectures and publishing creative digital sketching engines that breathe on your screen. Handcrafted from Guwahati with ink &amp; code.
            </p>
          </div>

          {/* Social connections layout column */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#f5f2ed]/40 border-b border-[#f5f2ed]/10 pb-1.5 font-bold">
              Connect
            </span>
            <div className="flex flex-wrap gap-4 font-mono text-xs text-[#ffd6e0] font-bold">
              <a
                href="https://github.com/AAB-I-XES"
                target="_blank"
                referrerPolicy="no-referrer"
                className="hover:text-white transition-colors"
              >
                [ GITHUB &rarr; ]
              </a>
              <a
                href="https://www.linkedin.com/in/dibyajyoti-rabha-250671391"
                target="_blank"
                referrerPolicy="no-referrer"
                className="hover:text-white transition-colors"
              >
                [ LINKEDIN &rarr; ]
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                referrerPolicy="no-referrer"
                className="hover:text-white transition-colors"
              >
                [ TWITTER &rarr; ]
              </a>
            </div>
          </div>

          {/* Scroll back to top */}
          <button
            onClick={onScrollToTop}
            className="flex items-center gap-2 px-4 py-2 border border-[#f5f2ed]/15 rounded-full hover:bg-white hover:text-[#141414] transition-all cursor-pointer font-mono text-xs uppercase group shrink-0 font-bold"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

        </div>

        {/* Lower footer copyright stats row */}
        <div className="border-t border-[#f5f2ed]/10 pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-[#f5f2ed]/45 gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-[#ffd6e0] animate-pulse" />
            <span>&copy; 2026 DIBYAJYOTI RABHA. METICULOUSLY CRAFTED</span>
          </div>
          <div className="flex gap-4 uppercase font-bold text-[#f5f2ed]/30">
            <span>Guwahati, Assam</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
