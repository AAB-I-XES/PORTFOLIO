import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { Palette, PenTool, Sparkles, Wand2, RefreshCw } from "lucide-react";
import { BIO_SUMMARY } from "../data";

// Custom sketch paths representing handcrafted elements
const STAMPS = [
  // 1. Star
  "M 0 -15 L 4 -4 L 15 -4 L 6 3 L 10 14 L 0 7 L -10 14 L -6 3 L -15 -4 L -4 -4 Z",
  // 2. Heart
  "M 0 -8 C -5 -15, -15 -10, -15 -3 C -15 5, -5 12, 0 16 C 5 12, 15 5, 15 -3 C 15 -10, 5 -15, 0 -8 Z",
  // 3. Mini Computer Screen
  "M -12 -10 L 12 -10 L 12 5 L -12 5 Z M -5 5 L -8 12 L 8 12 L 5 5 Z",
  // 4. Sparkle outline
  "M 0 -12 C 0 -2, 2 0, 12 0 C 2 0, 0 2, 0 12 C 0 2, -2 0, -12 0 C -2 0, 0 -2, 0 -12 Z",
  // 5. Crescent Moon
  "M -4 -12 C 4 -12, 10 -6, 10 2 C 10 10, 3 16, -5 16 C -1 11, -1 3, -4 -12 Z"
];

interface StampInstance {
  id: number;
  x: number;
  y: number;
  path: string;
  rotation: number;
  scale: number;
  color: string;
}

export default function BioSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<SVGSVGElement>(null);
  
  // Stamp state
  const [stamps, setStamps] = useState<StampInstance[]>([]);
  const [selectedStampIdx, setSelectedStampIdx] = useState(0);
  const [inkColor, setInkColor] = useState("#141414");

  // Freehand drawing points
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [savedPaths, setSavedPaths] = useState<string[]>([]);

  // Scroll tracking for the typographic typing/fade reveal
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Smooth scroll translation for paralax storytelling
  const bioY = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -40]);
  const smoothBioY = useSpring(bioY, { stiffness: 100, damping: 20 });

  // Word-by-word scroll highlight reveal
  const fullBioText = `${BIO_SUMMARY.intro} ${BIO_SUMMARY.detailedBio}`;
  const words = fullBioText.split(" ");
  
  // Map words to progressive visibility range [0.15 to 0.65 of scroll progress]
  const wordCount = words.length;

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add a stamp
    const newStamp: StampInstance = {
      id: Date.now() + Math.random(),
      x,
      y,
      path: STAMPS[selectedStampIdx],
      rotation: Math.random() * 60 - 30, // -30 to 30 deg
      scale: Math.random() * 0.4 + 0.8, // 0.8 to 1.2 scale
      color: inkColor
    };

    setStamps((prev) => [...prev, newStamp]);
  };

  // Freehand drawing handlers
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setCurrentPath(`M ${x} ${y}`);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentPath((prev) => `${prev} L ${x} ${y}`);
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      if (currentPath) {
        setSavedPaths((prev) => [...prev, currentPath]);
        setCurrentPath("");
      }
    }
  };

  const clearCanvas = () => {
    setStamps([]);
    setSavedPaths([]);
    setCurrentPath("");
  };

  return (
    <section
      id="bio"
      ref={containerRef}
      className="min-h-screen w-full relative flex flex-col justify-center py-20 px-6 md:px-12 bg-[#fcebeb] border-t border-[#141414]/10 overflow-hidden"
    >
      {/* Background sketch elements */}
      <div className="absolute inset-0 sketch-grid-dark opacity-40 pointer-events-none" />
      
      {/* Section indicator */}
      <div className="max-w-7xl mx-auto w-full mb-12 flex justify-between items-center border-b border-[#141414]/10 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#141414]/50 font-bold uppercase tracking-wider">
            02 / BIOGRAPHY
          </span>
          <span className="font-display font-black text-lg tracking-wider text-[#141414] uppercase">
            Story &amp; Creative Mindset
          </span>
        </div>
        <span className="font-mono text-[10px] tracking-widest text-[#141414]/50 uppercase hidden sm:inline">
          [ SCROLL PROGRESS ]
        </span>
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* LEFT COLUMN: THE NARRATIVE STORY (Scroll typing/reveal) */}
        <motion.div 
          style={{ y: smoothBioY }}
          className="lg:col-span-7 space-y-8"
        >
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#141414]/60 uppercase">
            <PenTool className="w-4 h-4 text-[#141414]/70" />
            <span>Background</span>
          </div>

          <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight text-[#141414] leading-tight uppercase">
            Drafting interfaces with <span className="font-serif italic font-normal text-stroke-black">artistic intent</span>
          </h2>

          {/* Typing On Scroll effect wrapper */}
          <div className="text-[#141414]/30 font-sans text-base md:text-xl md:leading-relaxed font-semibold tracking-wide select-text">
            {words.map((word, index) => {
              // Word scroll timeline chunk
              const startRange = 0.12 + (index / wordCount) * 0.45;
              const endRange = startRange + 0.05;
              
              // Map transparency based on current scroll
              const wordOpacity = useTransform(scrollYProgress, [startRange, endRange], [0.15, 1.0]);
              const wordColor = useTransform(scrollYProgress, [startRange, endRange], ["#14141430", "#141414"]);

              return (
                <motion.span
                  key={index}
                  style={{ opacity: wordOpacity, color: wordColor }}
                  className="inline-block mr-1.5 transition-colors duration-100"
                >
                  {word}
                </motion.span>
              );
            })}
          </div>

          <div className="pt-4 flex flex-wrap gap-3">
            <span className="font-mono text-xs px-3 py-1.5 rounded-full border border-[#141414]/15 bg-white/50 text-[#141414]/85">
              #CreativeIllustration
            </span>
            <span className="font-mono text-xs px-3 py-1.5 rounded-full border border-[#141414]/15 bg-white/50 text-[#141414]/85">
              #VectorVisualist
            </span>
            <span className="font-mono text-xs px-3 py-1.5 rounded-full border border-[#141414]/15 bg-white/50 text-[#141414]/85">
              #FunctionalArt
            </span>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: INTERACTIVE DRAWING STATION (Creative showcase) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-[#f5f2ed] rounded-2xl border-2 border-[#141414] p-4 shadow-[4px_4px_0px_#141414] relative overflow-hidden flex flex-col">
            
            {/* Header Controls */}
            <div className="flex justify-between items-center border-b border-[#141414]/10 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#141414]" />
                <span className="font-mono text-xs uppercase font-bold text-[#141414]">
                  Dibya's Creative Pad
                </span>
              </div>
              <button
                onClick={clearCanvas}
                className="p-1.5 rounded-md hover:bg-[#ffd6e0] transition-colors cursor-pointer text-[#141414]/60 hover:text-[#141414]"
                title="Clear Sketchpad"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Instruction block */}
            <div className="text-[11px] font-mono text-[#141414]/60 mb-2 leading-relaxed">
              [ Click to stamp vector outlines, or drag mouse to draw freehand vectors. Feel the art! ]
            </div>

            {/* Main Interactive Drawing SVG Area */}
            <svg
              ref={canvasRef}
              onClick={handleCanvasClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="w-full h-72 md:h-80 border-2 border-dashed border-[#141414]/15 rounded-xl bg-white/65 cursor-crosshair relative overflow-hidden active:scale-[0.99] transition-transform"
            >
              <rect width="100%" height="100%" fill="none" />
              
              {/* Canvas Background Grid */}
              <g opacity="0.3">
                <line x1="10%" y1="0" x2="10%" y2="100%" stroke="#141414" strokeWidth="0.5" strokeDasharray="4" />
                <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#141414" strokeWidth="0.5" strokeDasharray="4" />
                <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#141414" strokeWidth="0.5" strokeDasharray="4" />
                <line x1="70%" y1="0" x2="70%" y2="100%" stroke="#141414" strokeWidth="0.5" strokeDasharray="4" />
                <line x1="90%" y1="0" x2="90%" y2="100%" stroke="#141414" strokeWidth="0.5" strokeDasharray="4" />
                <line x1="0" y1="20%" x2="100%" y2="20%" stroke="#141414" strokeWidth="0.5" strokeDasharray="4" />
                <line x1="0" y1="40%" x2="100%" y2="40%" stroke="#141414" strokeWidth="0.5" strokeDasharray="4" />
                <line x1="0" y1="60%" x2="100%" y2="60%" stroke="#141414" strokeWidth="0.5" strokeDasharray="4" />
                <line x1="0" y1="80%" x2="100%" y2="80%" stroke="#141414" strokeWidth="0.5" strokeDasharray="4" />
              </g>

              {/* Freehand Saved Lines */}
              {savedPaths.map((pathStr, i) => (
                <path
                  key={i}
                  d={pathStr}
                  fill="none"
                  stroke="#141414"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}

              {/* Freehand Current Line */}
              {currentPath && (
                <path
                  d={currentPath}
                  fill="none"
                  stroke="#141414"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Placed Stamps */}
              {stamps.map((stamp) => (
                <g
                  key={stamp.id}
                  transform={`translate(${stamp.x}, ${stamp.y}) rotate(${stamp.rotation}) scale(${stamp.scale})`}
                >
                  <path
                    d={stamp.path}
                    fill={stamp.color === "#141414" ? "transparent" : stamp.color}
                    stroke="#141414"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="line-drawing"
                  />
                  {/* Outer micro star accent */}
                  <circle cx="0" cy="0" r="1.5" fill="#141414" />
                </g>
              ))}

              {stamps.length === 0 && savedPaths.length === 0 && !currentPath && (
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  className="font-mono text-[10px] text-[#141414]/30 tracking-widest pointer-events-none"
                >
                  [ SKETCHBOARD CANVAS EMPTY ]
                </text>
              )}
            </svg>

            {/* Bottom Tools Toolbar */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#141414]/10">
              
              {/* Tool Option 1: Stamp Selector */}
              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#141414]/50">
                  Select Visual Stamp
                </span>
                <div className="flex gap-2">
                  {STAMPS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedStampIdx(idx)}
                      className={`w-7 h-7 rounded border flex items-center justify-center text-xs font-mono cursor-pointer transition-all ${
                        selectedStampIdx === idx
                          ? "bg-[#141414] text-[#f5f2ed] border-[#141414]"
                          : "bg-white hover:bg-[#141414]/5 border-[#141414]/15 text-[#141414]"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tool Option 2: Stamp Fill Color Selector */}
              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#141414]/50">
                  Stamp Color Mode
                </span>
                <div className="flex gap-2">
                  {[
                    { hex: "#141414", label: "Outline" },
                    { hex: "#ffd6e0", label: "Pink" },
                    { hex: "#f5f2ed", label: "Beige" }
                  ].map((colorObj) => (
                    <button
                      key={colorObj.hex}
                      onClick={() => setInkColor(colorObj.hex)}
                      className={`flex-1 py-1 rounded border font-mono text-[9px] tracking-wider uppercase cursor-pointer transition-all ${
                        inkColor === colorObj.hex
                          ? "bg-[#141414] text-white border-[#141414] shadow-xs"
                          : "bg-white hover:bg-[#141414]/5 border-[#141414]/15 text-[#141414]/70"
                      }`}
                    >
                      {colorObj.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
          
          <div className="text-[10px] font-mono tracking-widest text-[#141414]/50 uppercase flex justify-between px-2">
            <span>DRAWING CANVAS</span>
            <span>INTERACTIVE COMPONENT</span>
          </div>
        </div>

      </div>
    </section>
  );
}
