import { useEffect, useRef, useState } from "react";
import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl";
import "./FlyingPosters.css";

interface FlyingPostersProps {
  items: string[];
  fallbacks?: string[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  className?: string;
  planeWidth?: number;
  planeHeight?: number;
  gap?: number;
  distortion?: number;
  scrollEase?: number;
  cameraFov?: number;
  cameraZ?: number;
}

interface Viewport {
  width: number;
  height: number;
}

interface ScrollState {
  current: number;
  target: number;
}

interface PosterMedia {
  mesh: Mesh;
  program: Program;
  texture: Texture;
  image: HTMLImageElement;
  index: number;
  height: number;
  width: number;
  angle: number;
}

const vertexShader = `
precision highp float;
attribute vec3 position;
attribute vec2 uv;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const fragmentShader = `
precision highp float;
uniform vec2 uImageSize;
uniform vec2 uPlaneSize;
uniform sampler2D tMap;
varying vec2 vUv;

void main() {
  float imageAspect = uImageSize.x / max(uImageSize.y, 1.0);
  float planeAspect = uPlaneSize.x / max(uPlaneSize.y, 1.0);
  vec2 scale = vec2(1.0);
  if (planeAspect > imageAspect) scale.x = imageAspect / planeAspect;
  else scale.y = planeAspect / imageAspect;
  vec2 uv = vUv * scale + (1.0 - scale) * 0.5;
  gl_FragColor = texture2D(tMap, uv);
}`;

function modulo(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}

export default function FlyingPosters({
  items,
  fallbacks = [],
  activeIndex,
  onActiveIndexChange,
  className = "",
  planeWidth = 340,
  planeHeight = 390,
  gap = 44,
  distortion = 2.2,
  scrollEase = 0.075,
  cameraFov = 45,
  cameraZ = 20,
}: FlyingPostersProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef<ScrollState>({ current: 0, target: 0 });
  const stepRef = useRef(1);
  const onActiveIndexChangeRef = useRef(onActiveIndexChange);
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  onActiveIndexChangeRef.current = onActiveIndexChange;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || items.length === 0) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        canvas,
        alpha: true,
        antialias: true,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
      });
    } catch (error) {
      console.error("Flying posters could not initialize WebGL.", error);
      setWebglUnavailable(true);
      return;
    }

    setWebglUnavailable(false);
    const gl = renderer.gl;
    const camera = new Camera(gl);
    camera.fov = cameraFov;
    camera.position.z = cameraZ;
    const scene = new Transform();
    const geometry = new Plane(gl, { widthSegments: 80, heightSegments: 1 });
    const scroll = scrollRef.current;
    const medias: PosterMedia[] = [];
    let viewport: Viewport = { width: 1, height: 1 };
    let screen: Viewport = { width: 1, height: 1 };
    let animationFrame = 0;
    let activeMediaIndex = -1;
    let wheelGestureActive = false;
    let wheelGestureTimeout: number | undefined;

    const resize = () => {
      const bounds = container.getBoundingClientRect();
      screen = { width: bounds.width, height: bounds.height };
      if (!screen.width || !screen.height) return;
      renderer.setSize(screen.width, screen.height);
      camera.perspective({ aspect: screen.width / screen.height });
      const fov = (camera.fov * Math.PI) / 180;
      const height = 2 * Math.tan(fov / 2) * camera.position.z;
      viewport = { height, width: height * camera.aspect };

      medias.forEach((media) => {
        media.width = (viewport.width * planeWidth) / screen.width;
        media.height = (viewport.height * planeHeight) / screen.height;
        const spacing = media.height + (viewport.height * gap) / screen.height;
        media.mesh.scale.set(media.width, media.height, 1);
        media.program.uniforms.uPlaneSize.value = [media.width, media.height];
        media.mesh.position.y = -media.index * spacing;
      });
      stepRef.current = (medias[0]?.height ?? 1) + (viewport.height * gap) / screen.height;
    };

    items.forEach((src, index) => {
      const texture = new Texture(gl, { generateMipmaps: false });
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => {
        texture.image = image;
      };
      image.onerror = () => {
        const fallback = fallbacks[index];
        if (fallback && image.src !== fallback) {
          image.src = fallback;
        } else {
          console.error(`Flying poster image failed to load: ${src}`);
        }
      };
      image.src = src;

      const program = new Program(gl, {
        vertex: vertexShader,
        fragment: fragmentShader,
        uniforms: {
          tMap: { value: texture },
          uPlaneSize: { value: [0, 0] },
          uImageSize: { value: [1, 1] },
        },
        depthTest: false,
        depthWrite: false,
        cullFace: false,
      });
      const mesh = new Mesh(gl, { geometry, program });
      mesh.setParent(scene);
      medias.push({
        mesh,
        program,
        texture,
        image,
        index,
        height: 1,
        width: 1,
        angle: 0,
      });
    });

    resize();
    const handleResize = () => resize();
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (event.deltaY === 0) return;

      if (!wheelGestureActive) {
        wheelGestureActive = true;
        scroll.target += Math.sign(event.deltaY) * stepRef.current;
      }

      window.clearTimeout(wheelGestureTimeout);
      wheelGestureTimeout = window.setTimeout(() => {
        wheelGestureActive = false;
      }, 220);
    };

    const update = () => {
      scroll.current += (scroll.target - scroll.current) * scrollEase;
      const step = stepRef.current;
      const floatingIndex = scroll.current / step;
      const centerIndex = Math.round(floatingIndex);
      const activeIndex = modulo(centerIndex, items.length);
      if (activeIndex !== activeMediaIndex) {
        activeMediaIndex = activeIndex;
        onActiveIndexChangeRef.current(activeIndex);
      }

      medias.forEach((media) => {
        let offset = media.index - floatingIndex;
        if (offset > items.length / 2) offset -= items.length;
        else if (offset < -items.length / 2) offset += items.length;

        const isSelected = media.index === activeIndex;
        const targetAngle = isSelected ? 0 : offset * Math.min(distortion * 0.12, 0.48);
        media.angle += (targetAngle - media.angle) * scrollEase;
        const angle = media.angle;
        const radius = step * 1.65;
        media.mesh.position.y = -offset * step;
        media.mesh.position.x = Math.sin(angle) * radius;
        media.mesh.position.z = (Math.cos(angle) - 1) * radius;
        media.mesh.rotation.y = -angle;
        if (media.image.complete && media.image.naturalWidth > 0) {
          media.program.uniforms.uImageSize.value = [media.image.naturalWidth, media.image.naturalHeight];
        }
      });

      renderer.render({ scene, camera });
      animationFrame = window.requestAnimationFrame(update);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("resize", handleResize);
    animationFrame = window.requestAnimationFrame(update);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(wheelGestureTimeout);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("wheel", handleWheel);
      medias.forEach(({ image, program, mesh, texture }) => {
        image.onload = null;
        image.onerror = null;
        mesh.setParent(null);
        program.remove();
        gl.deleteTexture(texture.texture);
      });
      geometry.remove();
    };
  }, [items, fallbacks, planeWidth, planeHeight, gap, distortion, scrollEase, cameraFov, cameraZ]);

  useEffect(() => {
    const index = Math.max(0, Math.min(activeIndex, items.length - 1));
    const currentIndex = modulo(Math.round(scrollRef.current.target / stepRef.current), Math.max(items.length, 1));
    let difference = index - currentIndex;
    if (difference > items.length / 2) difference -= items.length;
    if (difference < -items.length / 2) difference += items.length;
    scrollRef.current.target += difference * stepRef.current;
  }, [activeIndex, items.length]);

  return (
    <div
      ref={containerRef}
      className={`flying-posters ${className}`}
      aria-label="Scroll to browse project posters"
    >
      <canvas
        ref={canvasRef}
        className={webglUnavailable ? "flying-posters__canvas is-unavailable" : "flying-posters__canvas"}
        aria-hidden="true"
      />
      {webglUnavailable && (
        <div className="flying-posters__fallback" aria-hidden="true">
          {items.map((src, index) => (
            <img
              key={`${src}-${index}`}
              src={fallbacks[index] || src}
              alt=""
              style={{
                transform: `translate3d(${(index % 3 - 1) * 24}px, ${(index - activeIndex) * 12}px, 0) rotate(${(index - activeIndex) * 3}deg) scale(${index === activeIndex ? 1 : 0.82})`,
                opacity: Math.max(0.15, 1 - Math.abs(index - activeIndex) * 0.2),
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
