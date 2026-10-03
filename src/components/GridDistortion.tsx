import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./GridDistortion.css";

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const fragmentShader = `
uniform sampler2D uDataTexture;
uniform sampler2D uTexture;
uniform vec2 uImageScale;
varying vec2 vUv;

void main() {
  vec4 offset = texture2D(uDataTexture, vUv);
  vec2 uv = (vUv - 0.5) * uImageScale + 0.5;
  gl_FragColor = texture2D(uTexture, uv - 0.02 * offset.rg);
}`;

interface GridDistortionProps {
  imageSrc: string;
  grid?: number;
  mouse?: number;
  strength?: number;
  relaxation?: number;
  className?: string;
}

export default function GridDistortion({
  grid = 15,
  mouse = 0.1,
  strength = 0.15,
  relaxation = 0.9,
  imageSrc,
  className = "",
}: GridDistortionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -1000, 1000);
    camera.position.z = 2;

    const size = Math.max(2, Math.floor(grid));
    const data = new Float32Array(4 * size * size);
    for (let index = 0; index < size * size; index++) {
      data[index * 4] = Math.random() * 255 - 125;
      data[index * 4 + 1] = Math.random() * 255 - 125;
    }

    const dataTexture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
    dataTexture.needsUpdate = true;

    const uniforms = {
      uTexture: { value: null as THREE.Texture | null },
      uDataTexture: { value: dataTexture },
      uImageScale: { value: new THREE.Vector2(1, 1) },
    };
    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
    });
    const geometry = new THREE.PlaneGeometry(1, 1, size - 1, size - 1);
    const plane = new THREE.Mesh(geometry, material);
    plane.visible = false;
    scene.add(plane);

    const handleResize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (width === 0 || height === 0) return;

      const aspect = width / height;
      renderer.setSize(width, height);
      plane.scale.set(aspect, 1, 1);
      camera.left = -aspect / 2;
      camera.right = aspect / 2;
      camera.updateProjectionMatrix();

      if (texture) {
        const image = texture.image as HTMLImageElement;
        const imageAspect = image.width / image.height;
        uniforms.uImageScale.value.set(
          imageAspect > aspect ? aspect / imageAspect : 1,
          imageAspect < aspect ? imageAspect / aspect : 1,
        );
      }
    };

    const textureLoader = new THREE.TextureLoader();
    let disposed = false;
    let texture: THREE.Texture | null = null;
    textureLoader.load(imageSrc, (loadedTexture) => {
      if (disposed) {
        loadedTexture.dispose();
        return;
      }
      loadedTexture.minFilter = THREE.LinearFilter;
      loadedTexture.magFilter = THREE.LinearFilter;
      loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
      loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
      texture = loadedTexture;
      uniforms.uTexture.value = loadedTexture;
      plane.visible = true;
      handleResize();
    });

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    const mouseState = { x: 0, y: 0, prevX: 0, prevY: 0, vX: 0, vY: 0 };
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) {
        handleMouseLeave();
        return;
      }

      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;
      mouseState.vX = x - mouseState.prevX;
      mouseState.vY = y - mouseState.prevY;
      Object.assign(mouseState, { x, y, prevX: x, prevY: y });
    };
    const handleMouseLeave = () => {
      Object.assign(mouseState, { x: 0, y: 0, prevX: 0, prevY: 0, vX: 0, vY: 0 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("blur", handleMouseLeave);

    let animationId = 0;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      for (let index = 0; index < size * size; index++) {
        data[index * 4] *= relaxation;
        data[index * 4 + 1] *= relaxation;
      }

      const gridMouseX = size * mouseState.x;
      const gridMouseY = size * mouseState.y;
      const maxDistance = size * mouse;
      for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
          const distanceSquared = (gridMouseX - x) ** 2 + (gridMouseY - y) ** 2;
          if (distanceSquared < maxDistance * maxDistance) {
            const index = 4 * (x + size * y);
            const power = Math.min(maxDistance / Math.sqrt(distanceSquared), 10);
            data[index] += strength * 100 * mouseState.vX * power;
            data[index + 1] -= strength * 100 * mouseState.vY * power;
          }
        }
      }

      dataTexture.needsUpdate = true;
      renderer.render(scene, camera);
    };

    handleResize();
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("blur", handleMouseLeave);
      geometry.dispose();
      material.dispose();
      dataTexture.dispose();
      texture?.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [grid, imageSrc, mouse, relaxation, strength]);

  return <div ref={containerRef} className={`distortion-container ${className}`} />;
}