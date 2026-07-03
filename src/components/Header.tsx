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
  Fingerprint,
  Send,
  MessageSquare,
  AlertTriangle,
  Play,
  Sliders,
  ChevronDown,
  ChevronUp,
  Inbox
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

  // Nav Pill Modal states
  const [activeModal, setActiveModal] = useState<"extras" | "faq" | "forum" | "report" | null>(null);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);
  const [forumPosts, setForumPosts] = useState<Array<{ name: string; text: string; time: string }>>([]);
  const [newPostName, setNewPostName] = useState("");
  const [newPostText, setNewPostText] = useState("");
  const [reportCategory, setReportCategory] = useState("Visual Glitch");
  const [reportDesc, setReportDesc] = useState("");
  const [reportSeverity, setReportSeverity] = useState("Mid");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportProgress, setReportProgress] = useState(0);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [ticketsList, setTicketsList] = useState<Array<{ id: string; category: string; severity: string; desc: string }>>([]);

  // Extras Sandbox states
  const [particleCount, setParticleCount] = useState(70);
  const [particleSpeed, setParticleSpeed] = useState(2.5);
  const [drawingStyle, setDrawingStyle] = useState<"vellum" | "neon" | "ink">("vellum");
  const extrasCanvasRef = useRef<HTMLCanvasElement>(null);

  const menuItems = [
    { id: "hero", label: "01", title: "GENESIS", subtitle: "HOME // LAUNCHPAD & CORE MISSION", spec: "MODEL_v3.5" },
    { id: "bio", label: "02", title: "CREATOR", subtitle: "ABOUT // PHILOSOPHY & STORY", spec: "BIOGRAPHY" },
    { id: "skills", label: "03", title: "FORGE", subtitle: "SKILLS // STACK & CAPABILITIES", spec: "SYS_ENG_v1" },
    { id: "projects", label: "04", title: "ARCHIVES", subtitle: "WORKS // CURATED PORTFOLIO", spec: "GIT_REPOS" },
    { id: "contact", label: "05", title: "DIRECT", subtitle: "CONTACT // REACH OUT TO COLLAB", spec: "SECURE_CONN" }
  ];

  const navPills = [
    { id: "home", label: "home" },
    { id: "extras", label: "extras" },
    { id: "faq", label: "faq" },
    { id: "forum", label: "forum" },
    { id: "report", label: "report issue" }
  ];

  // Sync forum and ticket lists from localStorage
  useEffect(() => {
    if (!isMenuOpen) return;
    
    const storedPosts = localStorage.getItem("portfolio_forum_posts");
    if (storedPosts) {
      setForumPosts(JSON.parse(storedPosts));
    } else {
      const defaultPosts = [
        { name: "Siddharth", text: "The elastic spring canvas in the menu is absolutely insane!", time: "2 hours ago" },
        { name: "Elena_K", text: "Guwahati has some awesome hidden talent. This design aesthetic is 10/10.", time: "1 day ago" },
        { name: "Pranav_Dev", text: "Love how lightweight the micro-interactions feel. Crisp and fluid.", time: "3 days ago" }
      ];
      setForumPosts(defaultPosts);
      localStorage.setItem("portfolio_forum_posts", JSON.stringify(defaultPosts));
    }

    const storedTickets = localStorage.getItem("portfolio_tickets");
    if (storedTickets) {
      setTicketsList(JSON.parse(storedTickets));
    }
  }, [isMenuOpen]);

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

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostName.trim() || !newPostText.trim()) return;
    
    const newPost = {
      name: newPostName.trim(),
      text: newPostText.trim(),
      time: "Just now"
    };
    const updated = [newPost, ...forumPosts];
    setForumPosts(updated);
    localStorage.setItem("portfolio_forum_posts", JSON.stringify(updated));
    setNewPostName("");
    setNewPostText("");
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDesc.trim()) return;

    setIsSubmittingReport(true);
    setReportProgress(0);
    
    const interval = setInterval(() => {
      setReportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          const tktId = `TKT-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
          setSubmittedTicket(tktId);
          setIsSubmittingReport(false);
          
          const newTicket = {
            id: tktId,
            category: reportCategory,
            severity: reportSeverity,
            desc: reportDesc
          };
          const updatedTickets = [newTicket, ...ticketsList];
          setTicketsList(updatedTickets);
          localStorage.setItem("portfolio_tickets", JSON.stringify(updatedTickets));
          setReportDesc("");
          return 100;
        }
        return prev + 20;
      });
    }, 150);
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

  // Interactive Extras Canvas Simulation
  useEffect(() => {
    if (activeModal !== "extras") return;
    const canvas = extrasCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = canvas.width = canvas.parentElement?.clientWidth || 400;
    let height = canvas.height = canvas.parentElement?.clientHeight || 250;

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * particleSpeed,
      vy: (Math.random() - 0.5) * particleSpeed,
      size: Math.random() * 3 + 1,
      color: `hsl(${Math.random() * 360}, 75%, 60%)`
    }));

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleCanvasMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    canvas.addEventListener("mousemove", handleCanvasMouseMove);

    const run = () => {
      if (drawingStyle === "vellum") {
        ctx.fillStyle = "#fbf9f4";
        ctx.fillRect(0, 0, width, height);
        // Draw grid
        ctx.strokeStyle = "rgba(20, 20, 20, 0.04)";
        ctx.lineWidth = 0.5;
        for (let x = 0; x < width; x += 20) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += 20) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      } else if (drawingStyle === "neon") {
        ctx.fillStyle = "rgba(20, 20, 20, 0.12)";
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.fillStyle = "rgba(245, 242, 237, 0.15)";
        ctx.fillRect(0, 0, width, height);
      }

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.vx += (dx / dist) * 0.12;
          p.vy += (dy / dist) * 0.12;
        }

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpeed = particleSpeed * 1.5;
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        if (drawingStyle === "vellum") {
          ctx.fillStyle = "#e05050";
        } else if (drawingStyle === "neon") {
          ctx.fillStyle = p.color;
        } else {
          ctx.fillStyle = "#141414";
        }
        ctx.fill();
      });

      if (drawingStyle === "vellum") {
        ctx.strokeStyle = "rgba(224, 80, 80, 0.18)";
        ctx.lineWidth = 0.5;
        particles.forEach((p) => {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(mouseX, mouseY);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }
        });
      }

      animId = requestAnimationFrame(run);
    };

    run();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleCanvasMouseMove);
    };
  }, [activeModal, particleCount, particleSpeed, drawingStyle]);

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
              className="hidden lg:flex w-[43%] h-full flex-col justify-start px-12 pt-[2.5rem] pb-12 relative z-10 border-r border-[#141414]/10 bg-[#fbf9f4]/94 backdrop-blur-md shadow-2xl"
            >
              <div className="flex justify-between items-center font-mono text-[8px] tracking-widest text-[#141414]/40 uppercase font-black border-b border-[#141414]/10 pb-4">
                <span>MODULE // SKETCHBOOK DIRECTORY</span>
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-[#e05050] animate-pulse" /> LIVE SCHEMATIC
                </span>
              </div>

              <div className="mt-12 mb-auto space-y-6 max-w-sm pl-4 border-l-2 border-[#e05050]/40 py-2">
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

              <div className="flex items-center gap-3 text-[9px] font-mono tracking-widest text-[#141414]/40 font-bold mt-auto">
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
              className="flex-1 h-full flex flex-col justify-start px-6 pt-24 md:px-20 md:pb-12 md:pt-[2.5rem] relative z-10 bg-[#f6f3eb]/95 backdrop-blur-md shadow-2xl overflow-y-auto"
            >
              {/* Responsive Header for Mobile layout */}
              <div className="flex justify-between items-center font-mono text-[8px] tracking-widest text-[#141414]/40 uppercase font-black border-b border-[#141414]/10 pb-4 lg:hidden mb-6">
                <span>DIBYAJYOTI // INDEX</span>
                <span>05 MAPPED TARGETS</span>
              </div>

              <div className="max-w-xl w-full mx-auto mt-0 mb-auto space-y-8">
                {/* HORIZONTAL NAV PILLS */}
                <div className="flex flex-col gap-2 pb-4">
                  <span className="font-mono text-[8px] tracking-widest text-[#141414]/40 uppercase font-black">
                    QUICK // CHANNELS
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {navPills.map((pill) => (
                      <button
                        key={pill.id}
                        onClick={() => {
                          if (pill.id === "home") {
                            handleLinkClick("hero");
                          } else {
                            setActiveModal(pill.id as any);
                          }
                        }}
                        className="cursor-pointer px-4 py-2 rounded-full border border-[#141414] bg-[#fcfbfa] text-[#141414] font-mono text-[9px] font-bold tracking-wider uppercase transition-all duration-300 hover:bg-[#141414] hover:text-white hover:shadow-[3px_3px_0px_#e05050]"
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="font-mono text-[9px] tracking-widest text-[#e05050] uppercase font-black flex justify-between items-center pb-2 border-b border-[#141414]/10 pt-6">
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

            {/* IN-NAV SYSTEM MODALS */}
            <AnimatePresence>
              {activeModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-[#141414]/40 backdrop-blur-md"
                >
                  <motion.div
                    initial={{ scale: 0.95, y: 15 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 15 }}
                    transition={{ type: "spring", stiffness: 350, damping: 26 }}
                    className="bg-[#fcfbfa] border-2 border-[#141414] rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-[8px_8px_0px_#141414] relative flex flex-col p-6 md:p-8"
                  >
                    
                    {/* Modal Header */}
                    <div className="flex items-center justify-between border-b border-[#141414]/10 pb-4 mb-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#e05050] animate-pulse" />
                        <span className="font-mono text-[10px] font-black tracking-widest uppercase text-[#141414]/50">
                          SYSTEM // MODULE_{activeModal}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setActiveModal(null);
                          setOpenFaqIdx(null);
                          setSubmittedTicket(null);
                        }}
                        className="cursor-pointer w-8 h-8 rounded-full border border-[#141414]/15 flex items-center justify-center hover:bg-[#141414] hover:text-[#f5f2ed] transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Modal Body */}
                    <div className="flex-1">
                      {activeModal === "extras" && (
                        <div className="space-y-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#141414]/5 p-4 rounded-2xl border border-[#141414]/10">
                            <div>
                              <h5 className="font-display font-black text-lg text-[#141414]">VECTOR PLAYGROUND</h5>
                              <p className="font-mono text-[10px] text-[#141414]/60 uppercase tracking-widest mt-1">
                                Drag or move cursor to attract drafting nodes
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {(["vellum", "neon", "ink"] as const).map((style) => (
                                <button
                                  key={style}
                                  onClick={() => setDrawingStyle(style)}
                                  className={`cursor-pointer px-3 py-1 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase border transition-all ${
                                    drawingStyle === style
                                      ? "bg-[#141414] text-[#fbf9f4] border-[#141414]"
                                      : "bg-transparent text-[#141414]/60 border-[#141414]/15 hover:border-[#141414] hover:text-[#141414]"
                                  }`}
                                >
                                  {style}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Live Canvas Area */}
                          <div className="relative w-full h-56 rounded-2xl border-2 border-[#141414] bg-[#fbf9f4] overflow-hidden shadow-[4px_4px_0px_rgba(20,20,20,0.08)]">
                            <canvas ref={extrasCanvasRef} className="w-full h-full block" />
                          </div>

                          {/* Control sliders */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#141414]/5 p-4 rounded-2xl border border-[#141414]/10">
                            <div className="space-y-2">
                              <div className="flex justify-between font-mono text-[10px] text-[#141414]/60 font-black">
                                <span>PARTICLE COUNT</span>
                                <span>{particleCount} NODES</span>
                              </div>
                              <input
                                type="range"
                                min="20"
                                max="150"
                                value={particleCount}
                                onChange={(e) => setParticleCount(Number(e.target.value))}
                                className="w-full accent-[#e05050] bg-[#141414]/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between font-mono text-[10px] text-[#141414]/60 font-black">
                                <span>PHYSICS SPEED</span>
                                <span>{particleSpeed.toFixed(1)}x</span>
                              </div>
                              <input
                                type="range"
                                min="0.5"
                                max="6.0"
                                step="0.5"
                                value={particleSpeed}
                                onChange={(e) => setParticleSpeed(Number(e.target.value))}
                                className="w-full accent-[#e05050] bg-[#141414]/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {activeModal === "faq" && (
                        <div className="space-y-4">
                          {[
                            {
                              q: "Who is Dibyajyoti Rabha?",
                              a: "A creative coder, UI engineer, and illustrator based in Guwahati, India. He merges digital vector drawings, fluid animations, and solid full-stack structures to build distinctive web experiences."
                            },
                            {
                              q: "What is the design concept behind this portfolio?",
                              a: "It's built with a 'Vellum Sketchbook' theme — combining structural blueprint guidelines, physical elastic-spring particle networks, retro serif displays, and high-performance SVG/HTML5 canvas components."
                            },
                            {
                              q: "Is the vector canvas interactive?",
                              a: "Yes! The entire background is simulated in real-time. Hovering over menu items creates vector locks that snap elements dynamically into technical alignments."
                            },
                            {
                              q: "Can I use or adapt this codebase?",
                              a: "The project code is open source and hosted on GitHub under AAB-I-XES. Feel free to explore it, star it, or use elements for your own creative sketches."
                            }
                          ].map((faq, i) => {
                            const isOpen = openFaqIdx === i;
                            return (
                              <div key={i} className="border-2 border-[#141414] rounded-2xl overflow-hidden bg-white shadow-[2px_2px_0px_#141414]">
                                <button
                                  type="button"
                                  onClick={() => setOpenFaqIdx(isOpen ? null : i)}
                                  className="w-full px-5 py-4 flex items-center justify-between text-left font-display font-bold text-[#141414] hover:bg-[#141414]/5 transition-colors cursor-pointer"
                                >
                                  <span>{faq.q}</span>
                                  {isOpen ? <ChevronUp className="w-4 h-4 text-[#e05050]" /> : <ChevronDown className="w-4 h-4 text-[#141414]/50" />}
                                </button>
                                <AnimatePresence initial={false}>
                                  {isOpen && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="border-t border-[#141414]/10 px-5 py-4 bg-[#fbf9f4] font-mono text-[10px] text-[#141414]/70 leading-relaxed uppercase tracking-wide"
                                    >
                                      {faq.a}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {activeModal === "forum" && (
                        <div className="space-y-6">
                          {/* Write a message */}
                          <form onSubmit={handleAddPost} className="bg-[#141414]/5 p-4 rounded-2xl border border-[#141414]/10 space-y-3.5">
                            <span className="font-mono text-[9px] text-[#e05050] font-black uppercase tracking-widest">[ COMMUNITY FEEDBACK WALL ]</span>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <input
                                type="text"
                                required
                                placeholder="YOUR HANDLE / NAME"
                                value={newPostName}
                                onChange={(e) => setNewPostName(e.target.value)}
                                className="md:col-span-1 px-4 py-2.5 rounded-xl border border-[#141414]/20 bg-white font-mono text-[10px] uppercase font-bold tracking-wider placeholder:text-[#141414]/30 focus:border-[#141414] focus:outline-none"
                              />
                              <input
                                type="text"
                                required
                                placeholder="POST A MESSAGE..."
                                value={newPostText}
                                onChange={(e) => setNewPostText(e.target.value)}
                                className="md:col-span-2 px-4 py-2.5 rounded-xl border border-[#141414]/20 bg-white font-mono text-[10px] uppercase font-bold tracking-wider placeholder:text-[#141414]/30 focus:border-[#141414] focus:outline-none"
                              />
                            </div>
                            <div className="flex justify-end">
                              <button
                                type="submit"
                                className="cursor-pointer inline-flex items-center gap-2 bg-[#141414] hover:bg-[#141414]/90 text-[#f5f2ed] font-mono text-[9px] font-bold tracking-widest uppercase px-5 py-2.5 rounded-full shadow-[2px_2px_0px_#e05050] active:translate-y-[1px]"
                              >
                                <Send className="w-3 h-3" /> BROADCAST MESSAGE
                              </button>
                            </div>
                          </form>

                          {/* Posts Feed */}
                          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                            {forumPosts.map((post, index) => (
                              <div key={index} className="p-4 border border-[#141414]/10 rounded-2xl bg-white flex flex-col gap-1 shadow-sm">
                                <div className="flex justify-between items-center">
                                  <span className="font-mono text-[10px] text-[#e05050] font-black uppercase">
                                    @{post.name || "anonymous"}
                                  </span>
                                  <span className="font-mono text-[8px] text-[#141414]/40 font-bold uppercase">
                                    {post.time}
                                  </span>
                                </div>
                                <p className="font-sans text-[11px] font-medium text-[#141414] uppercase leading-relaxed">
                                  {post.text}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeModal === "report" && (
                        <div className="space-y-6">
                          {!submittedTicket ? (
                            <form onSubmit={handleTicketSubmit} className="space-y-5">
                              <div className="bg-[#141414]/5 p-4 rounded-2xl border border-[#141414]/10 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-1.5">
                                    <label className="font-mono text-[9px] text-[#141414]/50 uppercase font-black">CATEGORY</label>
                                    <select
                                      value={reportCategory}
                                      onChange={(e) => setReportCategory(e.target.value)}
                                      className="w-full px-4 py-2.5 rounded-xl border border-[#141414]/20 bg-white font-mono text-[10px] font-bold tracking-wider uppercase focus:border-[#141414] focus:outline-none"
                                    >
                                      <option>Visual Glitch</option>
                                      <option>Performance Lag</option>
                                      <option>Broken Link</option>
                                      <option>Typographical Error</option>
                                      <option>Feature Suggestion</option>
                                    </select>
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="font-mono text-[9px] text-[#141414]/50 uppercase font-black">SEVERITY LEVEL</label>
                                    <div className="flex gap-2">
                                      {["Low", "Mid", "High", "Critical"].map((sev) => (
                                        <button
                                          key={sev}
                                          type="button"
                                          onClick={() => setReportSeverity(sev)}
                                          className={`cursor-pointer flex-1 py-2 rounded-xl text-[9px] font-mono font-bold uppercase border transition-all ${
                                            reportSeverity === sev
                                              ? "bg-[#e05050] text-white border-[#e05050]"
                                              : "bg-white text-[#141414]/60 border-[#141414]/15 hover:border-[#141414]"
                                          }`}
                                        >
                                          {sev}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-1.5">
                                  <label className="font-mono text-[9px] text-[#141414]/50 uppercase font-black">ISSUE DESCRIPTION</label>
                                  <textarea
                                    required
                                    rows={3}
                                    value={reportDesc}
                                    onChange={(e) => setReportDesc(e.target.value)}
                                    placeholder="PLEASE ELABORATE ON THE SPECIFIC ERROR OR GLITCH ENCOUNTERED IN THE WORKSPACE..."
                                    className="w-full px-4 py-3 rounded-xl border border-[#141414]/20 bg-white font-mono text-[10px] font-bold tracking-wider placeholder:text-[#141414]/30 focus:border-[#141414] focus:outline-none resize-none uppercase"
                                  />
                                </div>
                              </div>

                              <div className="flex justify-between items-center">
                                <span className="font-mono text-[8px] text-[#141414]/40 font-bold uppercase tracking-widest">
                                  SECURE ENCRYPTED DISPATCH // AAB-I-XES
                                </span>
                                <button
                                  type="submit"
                                  disabled={isSubmittingReport}
                                  className="cursor-pointer bg-[#141414] text-white font-mono text-[9px] font-bold tracking-widest uppercase px-6 py-3 rounded-full hover:bg-[#e05050] transition-colors shadow-[3px_3px_0px_rgba(20,20,20,0.15)] disabled:opacity-50"
                                >
                                  {isSubmittingReport ? "DISPATCHING..." : "DISPATCH SYSTEM TICKET"}
                                </button>
                              </div>

                              {isSubmittingReport && (
                                <div className="space-y-1.5">
                                  <div className="flex justify-between font-mono text-[8px] text-[#141414]/40 font-black">
                                    <span>ENCRYPTING & ROUTING TICKET METADATA</span>
                                    <span>{reportProgress}%</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-[#141414]/10 rounded-full overflow-hidden">
                                    <div className="bg-[#e05050] h-full transition-all duration-300" style={{ width: `${reportProgress}%` }} />
                                  </div>
                                </div>
                              )}
                            </form>
                          ) : (
                            <motion.div
                              initial={{ scale: 0.95, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="bg-white border-2 border-[#141414] rounded-2xl p-6 text-center space-y-4 shadow-[3px_3px_0px_#141414]"
                            >
                              <div className="inline-flex p-3 rounded-full bg-[#e05050]/10 text-[#e05050] mb-2">
                                <AlertTriangle className="w-6 h-6 animate-bounce" />
                              </div>
                              <h5 className="font-display font-black text-xl text-[#141414] uppercase">TICKET ENQUEUED ON MAIN BRANCH</h5>
                              <p className="font-mono text-[10px] text-[#141414]/60 uppercase tracking-widest max-w-md mx-auto leading-relaxed">
                                System issue dispatch successfully queued. Your report was encrypted and appended to our active ticket ledger.
                              </p>
                              <div className="p-3 bg-[#141414]/5 rounded-xl border border-[#141414]/10 max-w-xs mx-auto">
                                <span className="font-mono text-xs text-[#e05050] font-black uppercase tracking-wider">ID: {submittedTicket}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setSubmittedTicket(null)}
                                className="cursor-pointer font-mono text-[9px] font-bold uppercase border border-[#141414] px-4 py-2 rounded-full hover:bg-[#141414] hover:text-[#f5f2ed] transition-colors"
                              >
                                SUBMIT ANOTHER REPORT
                              </button>
                            </motion.div>
                          )}

                          {/* Tickets History */}
                          {ticketsList.length > 0 && (
                            <div className="space-y-2 pt-4 border-t border-[#141414]/10">
                              <span className="font-mono text-[9px] text-[#141414]/50 font-black uppercase tracking-widest">[ RECENTLY SUBMITTED TICKETS ]</span>
                              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                                {ticketsList.map((tkt) => (
                                  <div key={tkt.id} className="p-3 bg-white border border-[#141414]/10 rounded-xl flex items-center justify-between text-[9px] font-mono">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[#e05050] font-black">{tkt.id}</span>
                                      <span className="text-[#141414]/40 font-bold uppercase">/ {tkt.category}</span>
                                      <span className="text-[#141414]/40 font-bold uppercase">/ {tkt.severity} severity</span>
                                    </div>
                                    <span className="px-2 py-0.5 rounded bg-[#141414]/5 text-[#141414]/60 font-black uppercase">PENDING_REVIEW</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
