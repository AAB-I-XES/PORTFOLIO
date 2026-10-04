import type { ButtonHTMLAttributes, ReactNode } from "react";
import GlassSurface from "./GlassSurface";
import "./LiquidButton.css";

interface LiquidButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  fullWidth?: boolean;
  radius?: number;
  active?: boolean;
  surfaceClassName?: string;
}

export default function LiquidButton({
  children,
  className = "",
  type = "button",
  fullWidth = false,
  radius = 999,
  active = false,
  surfaceClassName = "",
  ...buttonProps
}: LiquidButtonProps) {
  return (
    <GlassSurface
      width={fullWidth ? "100%" : "max-content"}
      height="max-content"
      borderRadius={radius}
      borderWidth={0.12}
      brightness={20}
      opacity={0.9}
      blur={10}
      displace={1.4}
      backgroundOpacity={0.18}
      saturation={1.5}
      distortionScale={-140}
      greenOffset={9}
      blueOffset={18}
      className={`liquid-button-surface${fullWidth ? " liquid-button-surface--full" : ""} ${surfaceClassName}`.trim()}
      data-active={active ? "" : undefined}
    >
      <button
        {...buttonProps}
        type={type}
        className={`liquid-button-control ${className}`.trim()}
      >
        {children}
      </button>
    </GlassSurface>
  );
}