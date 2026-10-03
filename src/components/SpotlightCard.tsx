import type { CSSProperties, MouseEvent, ReactNode } from "react";
import "./SpotlightCard.css";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}

type SpotlightStyle = CSSProperties & {
  "--mouse-x"?: string;
  "--mouse-y"?: string;
  "--spotlight-color"?: string;
};

export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(255, 255, 255, 0.12)",
}: SpotlightCardProps) {
  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mouse-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--mouse-y", `${event.clientY - bounds.top}px`);
  };

  const style: SpotlightStyle = { "--spotlight-color": spotlightColor };

  return (
    <div
      className={`reactbits-spotlight ${className}`}
      onMouseMove={handleMouseMove}
      style={style}
    >
      {children}
    </div>
  );
}
