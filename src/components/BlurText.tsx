import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

type BlurTextProps = {
  text: string;
  className?: string;
  delay?: number;
  stepDuration?: number;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
};

export default function BlurText({
  text,
  className = "",
  delay = 70,
  stepDuration = 0.28,
  animateBy = "words",
  direction = "bottom",
}: BlurTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [inView, setInView] = useState(false);
  const elements = useMemo(
    () => animateBy === "words" ? text.split(/(\s+)/) : Array.from(text),
    [animateBy, text],
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const offset = direction === "top" ? -18 : 18;

  return (
    <p ref={ref} aria-label={text} className={className}>
      {elements.map((segment, index) => (
        <motion.span
          key={`${index}-${segment}`}
          aria-hidden="true"
          className="inline-block will-change-[transform,filter,opacity]"
          initial={{ opacity: 0, filter: "blur(8px)", y: offset }}
          animate={prefersReducedMotion || inView
            ? { opacity: 1, filter: "blur(0px)", y: 0 }
            : { opacity: 0, filter: "blur(8px)", y: offset }}
          transition={{
            duration: prefersReducedMotion ? 0 : stepDuration,
            delay: prefersReducedMotion ? 0 : (index * delay) / 1000,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {segment.trim() ? segment : "\u00a0"}
        </motion.span>
      ))}
    </p>
  );
}
