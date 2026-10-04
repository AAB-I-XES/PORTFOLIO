import FaultyTerminal from "./FaultyTerminal";

export default function TerminalSectionBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.55]" aria-hidden="true">
      <FaultyTerminal
        scale={1.5}
        digitSize={1.4}
        timeScale={0.12}
        frameRate={20}
        dpr={0.5}
        scanlineIntensity={0.3}
        glitchAmount={0.25}
        flickerAmount={0.08}
        noiseAmp={0.65}
        chromaticAberration={0}
        dither={0.15}
        curvature={0.08}
        tint="#c9d8f0"
        mouseReact
        mouseStrength={0.35}
        pageLoadAnimation={false}
        brightness={1.5}
      />
    </div>
  );
}