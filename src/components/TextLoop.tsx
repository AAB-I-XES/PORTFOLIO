import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import "./TextLoop.css";

const VIEW_W = 1200;
const VIEW_H = 160;
const CX = VIEW_W / 2;
const CY = VIEW_H / 2;
const EDGE_PAD = 6;

type TextLoopShape = "wave" | "circle" | "infinity" | "arch" | "line";

interface TextLoopProps {
  text?: string;
  shape?: TextLoopShape;
  path?: string;
  speed?: number;
  direction?: "forward" | "reverse";
  separator?: string;
  curviness?: number;
  fontSize?: number;
  fontWeight?: number;
  letterSpacing?: number;
  uppercase?: boolean;
  color?: string;
  ribbon?: boolean;
  ribbonColor?: string;
  ribbonWidth?: number;
  pauseOnHover?: boolean;
  className?: string;
  style?: CSSProperties;
}

function buildPath(shape: TextLoopShape, curviness: number, ribbonWidth: number) {
  const curve = Math.max(0, curviness);
  const room = Math.max(20, CY - Math.max(0, ribbonWidth) / 2 - EDGE_PAD);

  switch (shape) {
    case "circle": {
      const radius = Math.min(90 + curve * 0.95, room);
      return `M ${CX - radius} ${CY} A ${radius} ${radius} 0 1 1 ${CX + radius} ${CY} A ${radius} ${radius} 0 1 1 ${CX - radius} ${CY} Z`;
    }
    case "infinity": {
      const radius = 150 + curve * 1.4;
      const height = Math.min(60 + curve * 0.95, room);
      return [
        `M ${CX} ${CY}`,
        `C ${CX + radius * 0.55} ${CY - height} ${CX + radius} ${CY - height} ${CX + radius} ${CY}`,
        `C ${CX + radius} ${CY + height} ${CX + radius * 0.55} ${CY + height} ${CX} ${CY}`,
        `C ${CX - radius * 0.55} ${CY - height} ${CX - radius} ${CY - height} ${CX - radius} ${CY}`,
        `C ${CX - radius} ${CY + height} ${CX - radius * 0.55} ${CY + height} ${CX} ${CY}`,
        "Z",
      ].join(" ");
    }
    case "arch": {
      const rise = Math.min(120 + curve * 1.1, room * 2);
      return `M 120 ${CY + rise / 2} Q ${CX} ${CY - rise * 1.5} ${VIEW_W - 120} ${CY + rise / 2}`;
    }
    case "line":
      return `M -320 ${CY} L ${VIEW_W + 320} ${CY}`;
    case "wave":
    default: {
      const amplitude = Math.min(curve * 2.2, room * 2);
      return `M -320 ${CY} Q -160 ${CY - amplitude} 0 ${CY} T 320 ${CY} T 640 ${CY} T 960 ${CY} T 1280 ${CY} T ${VIEW_W + 320} ${CY}`;
    }
  }
}

export default function TextLoop({
  text = "React ✦ Bits",
  shape = "wave",
  path,
  speed = 90,
  direction = "forward",
  separator = "✦",
  curviness = 90,
  fontSize = 46,
  fontWeight = 800,
  letterSpacing = 2,
  uppercase = true,
  color = "#ffffff",
  ribbon = true,
  ribbonColor = "#5227FF",
  ribbonWidth = 86,
  pauseOnHover = true,
  className = "",
  style = {},
}: TextLoopProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const measureRef = useRef<SVGTextElement>(null);
  const headRef = useRef<SVGTextPathElement>(null);
  const tailRef = useRef<SVGTextPathElement>(null);
  const [metrics, setMetrics] = useState({ length: 0, repetitions: 1 });

  const pathId = `text-loop-${useId().replace(/:/g, "")}`;
  const pathData = useMemo(
    () => path || buildPath(shape, curviness, ribbonWidth),
    [path, shape, curviness, ribbonWidth],
  );
  const unit = useMemo(() => {
    const phrase = uppercase ? text.toUpperCase() : text;
    const gap = separator ? `\u00a0${separator}\u00a0` : "\u00a0\u00a0\u00a0";
    return `${phrase}${gap}`;
  }, [text, separator, uppercase]);
  const textStyle = useMemo<CSSProperties>(
    () => ({ fontSize: `${fontSize}px`, fontWeight, letterSpacing: `${letterSpacing}px` }),
    [fontSize, fontWeight, letterSpacing],
  );

  useLayoutEffect(() => {
    const pathElement = pathRef.current;
    const measureElement = measureRef.current;
    if (!pathElement || !measureElement) return;

    let cancelled = false;
    const measure = () => {
      if (cancelled) return;
      const length = pathElement.getTotalLength();
      if (!length) return;
      const unitWidth = measureElement.getComputedTextLength();
      const repetitions = unitWidth > 0 ? Math.max(1, Math.round(length / unitWidth)) : 1;
      setMetrics((previous) => (
        previous.length === length && previous.repetitions === repetitions
          ? previous
          : { length, repetitions }
      ));
    };

    measure();
    if (typeof document !== "undefined" && document.fonts?.ready) {
      void document.fonts.ready.then(measure);
    }

    return () => {
      cancelled = true;
    };
  }, [pathData, unit, fontSize, fontWeight, letterSpacing]);

  useEffect(() => {
    const { length } = metrics;
    const head = headRef.current;
    const tail = tailRef.current;
    if (!head || !tail || !length) return;

    const applyOffset = (offset: number) => {
      const partner = offset >= 0 ? offset - length : offset + length;
      head.setAttribute("startOffset", String(offset));
      tail.setAttribute("startOffset", String(partner));
    };

    applyOffset(0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || speed <= 0) return;

    const state = { offset: 0 };
    const tween = gsap.to(state, {
      offset: direction === "reverse" ? -length : length,
      duration: length / speed,
      ease: "none",
      repeat: -1,
      onUpdate: () => applyOffset(state.offset),
    });
    const root = rootRef.current;
    const pause = () => tween.pause();
    const resume = () => tween.resume();

    if (pauseOnHover && root) {
      root.addEventListener("pointerenter", pause);
      root.addEventListener("pointerleave", resume);
    }

    return () => {
      tween.kill();
      if (pauseOnHover && root) {
        root.removeEventListener("pointerenter", pause);
        root.removeEventListener("pointerleave", resume);
      }
    };
  }, [metrics, speed, direction, pauseOnHover]);

  const loopText = unit.repeat(metrics.repetitions);

  return (
    <div ref={rootRef} className={`text-loop ${className}`.trim()} style={style}>
      <svg
        className="text-loop-svg"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={text}
      >
        <path
          ref={pathRef}
          id={pathId}
          d={pathData}
          fill="none"
          stroke={ribbon ? ribbonColor : "none"}
          strokeWidth={ribbon ? ribbonWidth : 0}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text ref={measureRef} className="text-loop-measure" style={textStyle} aria-hidden="true">
          {unit}
        </text>
        <text
          className="text-loop-text"
          style={textStyle}
          fill={color}
          dominantBaseline="central"
          aria-hidden="true"
          textLength={metrics.length || undefined}
          lengthAdjust="spacing"
        >
          <textPath ref={headRef} href={`#${pathId}`} startOffset={0}>
            {loopText}
          </textPath>
        </text>
        <text
          className="text-loop-text"
          style={textStyle}
          fill={color}
          dominantBaseline="central"
          aria-hidden="true"
          textLength={metrics.length || undefined}
          lengthAdjust="spacing"
        >
          <textPath ref={tailRef} href={`#${pathId}`} startOffset={0}>
            {loopText}
          </textPath>
        </text>
      </svg>
    </div>
  );
}
