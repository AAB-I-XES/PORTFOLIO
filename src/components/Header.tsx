import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Sparkles, 
  ArrowUpRight, 
  DraftingCompass,
  Activity,
  Compass,
  Ruler,
  Fingerprint
} from "lucide-react";

interface HeaderProps {
  onNavClick: (targetId: string) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

export default function Header({ onNavClick, isMenuOpen, setIsMenuOpen }: HeaderProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const [snapTarget, setSnapTarget] = useState<{ x: number; y: number } | null>(null);

  const menuItems = [
    { id: "hero", label: "01", title: "GENESIS", subtitle: "HOME // LAUNCHPAD & CORE MISSION", spec: "MODEL_v3.5" },
    { id: "bio", label: "02", title: "CREATOR", subtitle: "ABOUT // PHILOSOPHY & STORY", spec: "BIOGRAPHY" },
    { id: "skills", label: "03", title: "FORGE", subtitle: "SKILLS // STACK & CAPABILITIES", spec: "SYS_ENG_v1" },
    { id: "projects", label: "04", title: "ARCHIVES", subtitle: "WORKS // CURATED PORTFOLIO", spec: "GIT_REPOS" },
    { id: "contact", label: "05", title: "DIRECT", subtitle: "CONTACT // REACH OUT TO COLLAB", spec: "SECURE_CONN" }
  ];

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleLinkClick = (id: string) => {
    setIsMenuOpen(false);
    setSnapTarget(null);
    setHoveredIdx(null);
    
    // Allow curtain exit animations to resolve completely before scrolling
    setTimeout(() => {
      onNavClick(id);
    }, 600);
  };

  // High-performance physics drafting board canvas
  useEffect(() => {
    if (!isMenuOpen) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    let height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    // Procedural sketching anchor nodes (Optimized count for silky-smooth performance)
    const nodes = Array.from({ length: 7 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2 + 1
    }));

    let followX = width / 2;
    let followY = height / 2;

    const drawLoop = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw architectural grid lines
      const gridSize = 45;
      ctx.strokeStyle = "rgba(20, 20, 20, 0.02)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      let targetX = mousePos.current.x;
      let targetY = mousePos.current.y;

      if (snapTarget) {
        targetX = snapTarget.x;
        targetY = snapTarget.y;
      }

      // Smooth elastic damping
      followX += (targetX - followX) * 0.15;
      followY += (targetY - followY) * 0.15;

      // 2. Technical alignment drafting crosshairs
      ctx.strokeStyle = snapTarget ? "rgba(224, 80, 80, 0.2)" : "rgba(20, 20, 20, 0.04)";
      ctx.lineWidth = 0.5;
      ctx.setLineDash([3, 5]);

      ctx.beginPath();
      ctx.moveTo(0, followY);
      ctx.lineTo(width, followY);
      ctx.moveTo(followX, 0);
      ctx.lineTo(followX, height);
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Drafting snap target circles
      ctx.strokeStyle = snapTarget ? "rgba(224, 80, 80, 0.45)" : "rgba(20, 20, 20, 0.08)";
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      ctx.arc(followX, followY, snapTarget ? 14 : 6, 0, Math.PI * 2);
      ctx.stroke();

      // 4. Elastic physical springs connecting vellum anchors
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(20, 20, 20, 0.12)";
        ctx.fill();

        const dx = node.x - followX;
        const dy = node.y - followY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 320) {
          ctx.strokeStyle = `rgba(20, 20, 20, ${0.08 * (1 - dist / 320)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(followX, followY);
          ctx.lineTo(node.x, node.y);
          ctx.stroke();

          // Live pixel distance tags for high-fidelity specs look
          if (dist > 90 && dist < 180) {
            ctx.font = "8px 'JetBrains Mono', monospace";
            ctx.fillStyle = `rgba(224, 80, 80, ${0.25 * (1 - dist / 180)})`;
            ctx.fillText(`r=${dist.toFixed(0)}px`, (followX + node.x) / 2 + 5, (followY + node.y) / 2 - 4);
          }
        }
      });

      // 5. Annotative coordinates stamp
      ctx.font = "8px 'JetBrains Mono', monospace";
      ctx.fillStyle = "rgba(20, 20, 20, 0.4)";
      ctx.fillText(`X:${followX.toFixed(0)}  Y:${followY.toFixed(0)}`, followX + 18, followY + 12);
      
      if (snapTarget) {
        ctx.fillStyle = "rgba(224, 80, 80, 0.7)";
        ctx.fillText("// SNAP_LOCK", followX + 18, followY - 2);
      }

      animationFrameId = requestAnimationFrame(drawLoop);
    };

    drawLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMenuOpen, snapTarget]);

  const handleItemMouseEnter = (e: React.MouseEvent, index: number) => {
    setHoveredIdx(index);
    const canvas = canvasRef.current;
    if (canvas) {
      const canvasRect = canvas.getBoundingClientRect();
      const itemRect = e.currentTarget.getBoundingClientRect();
      setSnapTarget({
        x: itemRect.left - canvasRect.left + itemRect.width / 2,
        y: itemRect.top - canvasRect.top + itemRect.height / 2,
      });
    }
  };

  const handleItemMouseLeave = () => {
    setHoveredIdx(null);
    setSnapTarget(null);
  };

  return (
    <>
      {/* HEADER BAR (Positioned permanently on top) */}
      <header className="fixed top-0 left-0 w-full z-[100] px-6 py-6 md:px-12 md:py-8 flex justify-between items-center bg-transparent pointer-events-none">
        
        {/* LOGO */}
        <motion.div 
          initial={{ opacity: 0, x: -30, filter: "blur(4px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto cursor-pointer flex items-center gap-3.5 group"
          onClick={() => {
            setIsMenuOpen(false);
            onNavClick("hero");
          }}
        >
          <div className="w-11 h-11 rounded-full bg-[#141414] flex items-center justify-center text-[#f5f2ed] font-display font-black text-lg shadow-sm ring-4 ring-[#ffd6e0]/30 group-hover:scale-105 group-hover:rotate-6 transition-all duration-500">
            D
          </div>
          <div className="flex flex-col">
            <span className={`font-display font-black text-sm tracking-widest uppercase transition-colors duration-500 ${
              isMenuOpen ? "text-[#141414]" : "text-[#141414] dark:text-[#f5f2ed]"
            }`}>
              DIBYAJYOTI R.
            </span>
            <span className={`font-mono text-[9px] tracking-widest uppercase font-bold transition-colors duration-500 ${
              isMenuOpen ? "text-[#141414]/50" : "text-[#141414]/50 dark:text-[#f5f2ed]/50"
            }`}>
              Developer &bull; Illustrator
            </span>
          </div>
        </motion.div>

        {/* REVOLUTIONARY NAV TOGGLE */}
        <motion.div
          initial={{ opacity: 0, x: 30, filter: "blur(4px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto"
        >
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex items-center gap-3 px-5 py-3 rounded-full border-2 transition-all duration-500 cursor-pointer font-mono text-xs font-bold uppercase ${
              isMenuOpen 
                ? "border-[#141414] bg-[#141414] text-white shadow-[3px_3px_0px_rgba(20,20,20,0.15)] hover:bg-[#141414]/90" 
                : "border-[#141414] bg-[#f5f2ed] text-[#141414] shadow-[3px_3px_0px_#141414] hover:bg-[#141414] hover:text-white hover:shadow-[1px_1px_0px_#141414] hover:translate-x-[2px] hover:translate-y-[2px]"
            } group`}
            aria-label="Toggle navigation menu"
          >
            <span>{isMenuOpen ? "Close" : "Index"}</span>
            <div className="relative w-4 h-4 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close-icon"
                    initial={{ rotate: -180, opacity: 0, scale: 0.6 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 180, opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <X className="w-4 h-4 stroke-[2.5]" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu-icon"
                    initial={{ rotate: 180, opacity: 0, scale: 0.6 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -180, opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col justify-between w-4 h-2.5"
                  >
                    <span className="w-full h-[2px] bg-current rounded-full" />
                    <span className="w-3/4 h-[2px] bg-current rounded-full self-end group-hover:w-full transition-all duration-300" />
                    <span className="w-full h-[2px] bg-current rounded-full" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </button>
        </motion.div>
      </header>

      {/* FULLSCREEN SPLIT CURTAIN REVEAL OVERLAY (Guaranteed z-50 above standard page canvas) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex flex-col lg:flex-row bg-transparent text-[#141414] overflow-hidden select-none"
            onMouseMove={handleMouseMove}
          >
            {/* Interactive Vector Background Canvas */}
            <div className="absolute inset-0 z-0 opacity-85 pointer-events-none">
              <canvas ref={canvasRef} className="w-full h-full block" />
            </div>

            {/* Subtle premium drafting board paper texture overlay */}
            <div className="absolute inset-0 z-0 opacity-5 pointer-events-none bg-[radial-gradient(#141414_1px,transparent_1px)] [background-size:24px_24px]" />

            {/* LEFT HUD SCHEMATIC PANEL (Hidden on mobile - Slides in from left) */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:flex w-[43%] h-full flex-col justify-between p-16 relative z-10 border-r border-[#141414]/10 bg-[#fbf9f4]/94 backdrop-blur-md shadow-2xl"
            >
              <div className="flex justify-between items-center font-mono text-[8px] tracking-widest text-[#141414]/40 uppercase font-black border-b border-[#141414]/10 pb-4">
                <span>MODULE // SKETCHBOOK DIRECTORY</span>
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-[#e05050] animate-pulse" /> LIVE SCHEMATIC
                </span>
              </div>

              <div className="my-auto space-y-6 max-w-sm pl-4 border-l-2 border-[#e05050]/40 py-2">
                <div className="inline-flex p-3 rounded-2xl bg-[#141414]/5 border border-[#141414]/10 text-[#141414]">
                  <Compass className="w-5 h-5 animate-spin-slow text-[#e05050]" style={{ animationDuration: "12s" }} />
                </div>
                <h3 className="font-serif italic text-3.5xl text-[#141414] leading-tight font-normal">
                  Where organic drafts match strict system architecture.
                </h3>
                <p className="font-mono text-[10px] text-[#141414]/60 uppercase tracking-widest leading-relaxed">
                  [ DIRTY RECON // AAB-I-XES ]<br />
                  CURATOR DIBYAJYOTI RABHA DEPLOYS FREE-HAND VECTORS, MATHEMATICAL ALIGNMENT SNAPS, AND ELABORATED TYPE PAIRINGS TO CRAFT VISUALLY DISTINCT PLATFORMS.
                </p>
              </div>

              <div className="flex items-center gap-3 text-[9px] font-mono tracking-widest text-[#141414]/40 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#e05050] animate-pulse" />
                <span>SPEC // DESIGN PLATFORM v2.5</span>
              </div>
            </motion.div>

            {/* RIGHT INDEX NAVIGATION LIST (Slides in from right) */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 h-full flex flex-col justify-between p-8 md:p-20 relative z-10 bg-[#f6f3eb]/95 backdrop-blur-md shadow-2xl"
            >
              {/* Responsive Header for Mobile layout */}
              <div className="flex justify-between items-center font-mono text-[8px] tracking-widest text-[#141414]/40 uppercase font-black border-b border-[#141414]/10 pb-4 lg:hidden">
                <span>DIBYAJYOTI // INDEX</span>
                <span>05 MAPPED TARGETS</span>
              </div>

              <div className="hidden lg:block h-6" />

              <div className="max-w-xl w-full mx-auto my-auto space-y-10">
                <div className="font-mono text-[9px] tracking-widest text-[#e05050] uppercase font-black flex justify-between items-center pb-2 border-b border-[#141414]/10">
                  <span>INDEX SELECTOR</span>
                  <span>[ SYSTEM TARGETS ]</span>
                </div>

                <nav className="flex flex-col gap-4">
                  {menuItems.map((item, index) => {
                    const isHovered = hoveredIdx === index;
                    
                    return (
                      <div key={item.id} className="relative">
                        <button
                          onClick={() => handleLinkClick(item.id)}
                          onMouseEnter={(e) => handleItemMouseEnter(e, index)}
                          onMouseLeave={handleItemMouseLeave}
                          className="group flex items-start gap-5 text-left w-full cursor-pointer focus:outline-none py-3.5 relative px-4 rounded-2xl transition-all duration-300"
                        >
                          {/* Floating Offset Background Card on Hover */}
                          <AnimatePresence>
                            {isHovered && (
                              <motion.div
                                layoutId="navBgCard"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                                className="absolute inset-0 bg-[#fcfbfa] border-2 border-[#141414] rounded-2xl -z-10 shadow-[4px_4px_0px_#141414]"
                              />
                            )}
                          </AnimatePresence>

                          {/* Index numeric flag */}
                          <span className="font-mono text-[10px] text-[#e05050] font-black mt-2 tracking-wider transition-all duration-300 group-hover:scale-110">
                            {item.label}
                          </span>

                          <div className="flex-1 relative">
                            <div className="flex items-center justify-between">
                              <h4 className="font-display font-black text-2.5xl md:text-[2.5rem] leading-none tracking-tight text-[#141414] transition-colors duration-300 uppercase flex items-center gap-3">
                                {item.title}
                              </h4>
                              
                              <div className="overflow-hidden h-5 w-5 relative">
                                <ArrowUpRight className="w-4 h-4 text-[#141414]/30 group-hover:text-[#e05050] transition-all duration-300 absolute transform group-hover:translate-x-3 group-hover:-translate-y-3" />
                                <ArrowUpRight className="w-4 h-4 text-[#e05050] transition-all duration-300 absolute transform -translate-x-3 translate-y-3 group-hover:translate-x-0 group-hover:translate-y-0" />
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center mt-1">
                              <p className="font-mono text-[9px] text-[#141414]/40 tracking-widest uppercase font-bold transition-colors group-hover:text-[#141414]/70">
                                {item.subtitle}
                              </p>
                              <span className="font-mono text-[7.5px] text-[#141414]/35 uppercase tracking-wider hidden sm:inline">
                                {item.spec}
                              </span>
                            </div>
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </nav>

                <div className="pt-4 flex justify-between items-center font-mono text-[8px] tracking-widest text-[#141414]/30 uppercase font-black border-t border-[#141414]/10">
                  <span>DRAFT SPEC // VELLUM_GRID_v2.5</span>
                  <span>LOC // INDIA // UTC+5.5</span>
                </div>
              </div>

              <div className="h-6" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
