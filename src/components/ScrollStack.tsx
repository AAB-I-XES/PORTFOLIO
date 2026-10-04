import { useCallback, useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import "./ScrollStack.css";

interface ScrollStackProps {
  children: ReactNode;
  className?: string;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  onStackComplete?: () => void;
}

interface ScrollStackItemProps {
  children: ReactNode;
  itemClassName?: string;
}

const parsePosition = (value: string, height: number) =>
  value.includes("%") ? (parseFloat(value) / 100) * height : parseFloat(value);

export function ScrollStackItem({ children, itemClassName = "" }: ScrollStackItemProps) {
  return <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>;
}

export default function ScrollStack({
  children,
  className = "",
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = "20%",
  scaleEndPosition = "10%",
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  onStackComplete,
}: ScrollStackProps) {
  const stackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const transformsRef = useRef(new Map<number, string>());
  const completedRef = useRef(false);
  const updatingRef = useRef(false);

  const getOffset = useCallback((element: HTMLElement) => {
    let offset = 0;
    let current: HTMLElement | null = element;
    while (current) {
      offset += current.offsetTop;
      current = current.offsetParent as HTMLElement | null;
    }
    return offset;
  }, []);

  const updateCards = useCallback(() => {
    const stack = stackRef.current;
    if (!stack || !cardsRef.current.length || updatingRef.current) return;
    updatingRef.current = true;

    const scrollTop = window.scrollY;
    const height = window.innerHeight;
    const stackAt = parsePosition(stackPosition, height);
    const scaleAt = parsePosition(scaleEndPosition, height);
    const end = stack.querySelector<HTMLElement>(".scroll-stack-end");
    const pinEnd = (end ? getOffset(end) : 0) - height / 2;

    cardsRef.current.forEach((card, index) => {
      const cardTop = getOffset(card);
      const start = cardTop - stackAt - itemStackDistance * index;
      const scaleEnd = cardTop - scaleAt;
      const progress = scrollTop <= start
        ? 0
        : scrollTop >= scaleEnd
          ? 1
          : (scrollTop - start) / (scaleEnd - start);
      const scale = 1 - progress * (1 - (baseScale + index * itemScale));
      const rotation = rotationAmount * index * progress;

      let blur = 0;
      if (blurAmount) {
        cardsRef.current.forEach((otherCard, otherIndex) => {
          const otherStart = getOffset(otherCard) - stackAt - itemStackDistance * otherIndex;
          if (scrollTop >= otherStart && index < otherIndex) blur = (otherIndex - index) * blurAmount;
        });
      }

      const translateY = scrollTop >= start
        ? Math.min(scrollTop, pinEnd) - cardTop + stackAt + itemStackDistance * index
        : 0;
      const transform = `translate3d(0, ${Math.round(translateY * 100) / 100}px, 0) scale(${Math.round(scale * 1000) / 1000}) rotate(${Math.round(rotation * 100) / 100}deg)`;
      const filter = blur ? `blur(${blur}px)` : "";
      const lastTransform = transformsRef.current.get(index);
      const nextTransform = `${transform}|${filter}`;

      if (lastTransform !== nextTransform) {
        card.style.transform = transform;
        card.style.filter = filter;
        transformsRef.current.set(index, nextTransform);
      }

      if (index === cardsRef.current.length - 1) {
        if (scrollTop > pinEnd && !completedRef.current) {
          completedRef.current = true;
          onStackComplete?.();
        } else if (scrollTop < start) {
          completedRef.current = false;
        }
      }
    });

    updatingRef.current = false;
  }, [
    baseScale,
    blurAmount,
    getOffset,
    itemScale,
    itemStackDistance,
    onStackComplete,
    rotationAmount,
    scaleEndPosition,
    stackPosition,
  ]);

  useLayoutEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;
    cardsRef.current = Array.from(stack.querySelectorAll<HTMLElement>(".scroll-stack-card"));
    cardsRef.current.forEach((card, index) => {
      if (index < cardsRef.current.length - 1) card.style.marginBottom = `${itemDistance}px`;
      card.style.willChange = "transform, filter";
      card.style.transformOrigin = "top center";
      card.style.backfaceVisibility = "hidden";
    });

    gsap.ticker.add(updateCards);
    window.addEventListener("resize", updateCards);
    updateCards();
    return () => {
      gsap.ticker.remove(updateCards);
      window.removeEventListener("resize", updateCards);
      cardsRef.current = [];
      transformsRef.current.clear();
      completedRef.current = false;
      updatingRef.current = false;
    };
  }, [itemDistance, updateCards]);

  return (
    <div className={`scroll-stack ${className}`.trim()} ref={stackRef}>
      {children}
      <div className="scroll-stack-end" aria-hidden="true" />
    </div>
  );
}