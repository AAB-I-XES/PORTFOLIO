import { useCallback, useEffect, useLayoutEffect, useRef, useState, type FocusEvent, type MouseEvent } from "react";
import { gsap } from "gsap";
import GlassSurface from "./GlassSurface";
import "./StaggeredMenu.css";

export interface StaggeredMenuItem {
  label: string;
  ariaLabel: string;
  link: string;
  image?: string;
}

export interface StaggeredMenuSocialItem {
  label: string;
  link: string;
}

interface StaggeredMenuProps {
  position?: "left" | "right";
  colors?: string[];
  items?: StaggeredMenuItem[];
  socialItems?: StaggeredMenuSocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  className?: string;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  changeMenuColorOnOpen?: boolean;
  isFixed?: boolean;
  closeOnClickAway?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  onItemSelect?: (item: StaggeredMenuItem) => void;
  marqueeSpeed?: number;
}

interface StaggeredMenuRowProps {
  item: StaggeredMenuItem;
  index: number;
  numbering: boolean;
  open: boolean;
  speed: number;
  onSelect: (event: MouseEvent<HTMLAnchorElement>, item: StaggeredMenuItem) => void;
}

function StaggeredMenuRow({ item, index, numbering, open, speed, onSelect }: StaggeredMenuRowProps) {
  const itemRef = useRef<HTMLAnchorElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const horizontalTweenRef = useRef<gsap.core.Tween | null>(null);
  const hoverTweenRef = useRef<gsap.core.Tween | null>(null);
  const [repetitions, setRepetitions] = useState(4);

  useEffect(() => {
    const calculateRepetitions = () => {
      const part = marqueeInnerRef.current?.querySelector<HTMLElement>(".sm-marquee-part");
      if (!part || part.offsetWidth === 0) return;
      setRepetitions(Math.max(4, Math.ceil(window.innerWidth / part.offsetWidth) + 2));
    };

    calculateRepetitions();
    window.addEventListener("resize", calculateRepetitions);
    const observer = new ResizeObserver(calculateRepetitions);
    if (itemRef.current) observer.observe(itemRef.current);
    return () => {
      window.removeEventListener("resize", calculateRepetitions);
      observer.disconnect();
    };
  }, [item.label, item.image]);

  useEffect(() => {
    const inner = marqueeInnerRef.current;
    const part = inner?.querySelector<HTMLElement>(".sm-marquee-part");
    if (!inner || !part || part.offsetWidth === 0) return;

    horizontalTweenRef.current?.kill();
    horizontalTweenRef.current = gsap.to(inner, {
      x: -part.offsetWidth,
      duration: speed,
      ease: "none",
      repeat: -1,
    });
    return () => {
      horizontalTweenRef.current?.kill();
    };
  }, [item.label, item.image, repetitions, speed]);

  const animateEnter = (event?: MouseEvent<HTMLAnchorElement> | FocusEvent<HTMLAnchorElement>) => {
    const anchor = itemRef.current;
    const marquee = marqueeRef.current;
    const inner = marqueeInnerRef.current;
    if (!anchor || !marquee || !inner) return;

    const rect = anchor.getBoundingClientRect();
    const pointerY = event && "clientY" in event ? event.clientY - rect.top : rect.height / 2;
    const edge = pointerY < rect.height / 2 ? "top" : "bottom";
    hoverTweenRef.current?.kill();
    gsap.set(marquee, { y: edge === "top" ? "-101%" : "101%" });
    gsap.set(inner, { y: edge === "top" ? "101%" : "-101%" });
    hoverTweenRef.current = gsap.to([marquee, inner], {
      y: "0%",
      duration: 0.6,
      ease: "expo.out",
      overwrite: "auto",
    });
  };

  const animateLeave = (event?: MouseEvent<HTMLAnchorElement> | FocusEvent<HTMLAnchorElement>) => {
    const anchor = itemRef.current;
    const marquee = marqueeRef.current;
    const inner = marqueeInnerRef.current;
    if (!anchor || !marquee || !inner) return;

    const rect = anchor.getBoundingClientRect();
    const pointerY = event && "clientY" in event ? event.clientY - rect.top : rect.height / 2;
    const edge = pointerY < rect.height / 2 ? "top" : "bottom";
    hoverTweenRef.current?.kill();
    hoverTweenRef.current = gsap.to([marquee, inner], {
      y: edge === "top" ? "-101%" : "101%",
      duration: 0.6,
      ease: "expo.out",
      overwrite: "auto",
    });
  };

  useEffect(() => () => {
    hoverTweenRef.current?.kill();
  }, []);

  return (
    <li className="sm-panel-itemWrap">
      <a
        ref={itemRef}
        className="sm-panel-item"
        href={item.link}
        aria-label={item.ariaLabel}
        tabIndex={open ? 0 : -1}
        data-number={numbering ? String(index + 1).padStart(2, "0") : undefined}
        onMouseEnter={animateEnter}
        onMouseLeave={animateLeave}
        onFocus={animateEnter}
        onBlur={animateLeave}
        onClick={(event) => onSelect(event, item)}
      >
        <span className="sm-panel-itemLabel">{item.label}</span>
        <span className="sm-marquee" ref={marqueeRef} aria-hidden="true">
          <span className="sm-marquee-innerWrap">
            <span className="sm-marquee-inner" ref={marqueeInnerRef}>
              {Array.from({ length: repetitions }, (_, repetition) => (
                <span className="sm-marquee-part" key={repetition}>
                  <span>{item.label}</span>
                  {item.image && <span className="sm-marquee-image" style={{ backgroundImage: `url(${item.image})` }} />}
                </span>
              ))}
            </span>
          </span>
        </span>
      </a>
    </li>
  );
}

export default function StaggeredMenu({
  position = "right",
  colors = ["#333333", "#191919", "#080808"],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className = "",
  menuButtonColor = "#ffffff",
  openMenuButtonColor = "#ffffff",
  accentColor = "#d7d7d7",
  changeMenuColorOnOpen = true,
  isFixed = false,
  closeOnClickAway = true,
  onMenuOpen,
  onMenuClose,
  onItemSelect,
  marqueeSpeed = 15,
}: StaggeredMenuProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const preLayersRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const openRef = useRef(false);
  const busyRef = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const wrapper = wrapperRef.current;
    if (!panel || !wrapper) return;
    const layers = Array.from(wrapper.querySelectorAll<HTMLElement>(".sm-prelayer"));
    const headerItems = Array.from(wrapper.querySelectorAll<HTMLElement>(".sm-toggle"));
    const context = gsap.context(() => {
      gsap.set([panel, ...layers], { yPercent: -100, opacity: 1 });
      gsap.set(toggleRef.current, { color: menuButtonColor });
      gsap.set(iconRef.current, { rotate: 0 });
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        headerItems,
        {
          autoAlpha: 0,
          y: -40,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.5,
          delay: 0.1,
          ease: "power3.out",
          clearProps: "transform,opacity,visibility",
        },
      );
    }, wrapper);
    return () => context.revert();
  }, [menuButtonColor]);

  const closeMenu = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false;
    setOpen(false);
    onMenuClose?.();
    timelineRef.current?.kill();
    const panel = panelRef.current;
    const wrapper = wrapperRef.current;
    if (!panel || !wrapper) return;

    const layers = Array.from(wrapper.querySelectorAll<HTMLElement>(".sm-prelayer"));
    closeTweenRef.current?.kill();
    closeTweenRef.current = gsap.to([...layers, panel], {
      yPercent: -100,
      duration: 0.42,
      stagger: { each: 0.045, from: "end" },
      ease: "power3.in",
      overwrite: "auto",
      onComplete: () => { busyRef.current = false; },
    });
    gsap.to(iconRef.current, { rotate: 0, duration: 0.3, ease: "power2.inOut", overwrite: "auto" });
    if (toggleRef.current && changeMenuColorOnOpen) {
      gsap.to(toggleRef.current, { color: menuButtonColor, duration: 0.25, overwrite: "auto" });
    }
  }, [changeMenuColorOnOpen, menuButtonColor, onMenuClose]);

  const openMenu = useCallback(() => {
    if (busyRef.current || openRef.current) return;
    const panel = panelRef.current;
    const wrapper = wrapperRef.current;
    if (!panel || !wrapper) return;

    busyRef.current = true;
    openRef.current = true;
    setOpen(true);
    onMenuOpen?.();
    timelineRef.current?.kill();
    closeTweenRef.current?.kill();

    const layers = Array.from(wrapper.querySelectorAll<HTMLElement>(".sm-prelayer"));
    const labels = Array.from(panel.querySelectorAll<HTMLElement>(".sm-panel-itemLabel"));
    const numberedItems = Array.from(panel.querySelectorAll<HTMLElement>(".sm-panel-list[data-numbering] .sm-panel-item"));
    const socialTitle = panel.querySelector<HTMLElement>(".sm-socials-title");
    const socialLinks = Array.from(panel.querySelectorAll<HTMLElement>(".sm-socials-link"));

    gsap.set(labels, { yPercent: 130, rotate: 8 });
    gsap.set(numberedItems, { "--sm-num-opacity": 0 });
    gsap.set([socialTitle, ...socialLinks].filter(Boolean), { opacity: 0, y: 18 });

    const timeline = gsap.timeline({
      onComplete: () => { busyRef.current = false; },
    });
    timeline.to(layers, { yPercent: 0, duration: 0.55, stagger: 0.075, ease: "power4.out" }, 0);
    timeline.to(panel, { yPercent: 0, duration: 0.66, ease: "power4.out" }, 0.1);
    timeline.to(labels, { yPercent: 0, rotate: 0, duration: 0.8, stagger: 0.085, ease: "power4.out" }, 0.3);
    timeline.to(numberedItems, { "--sm-num-opacity": 1, duration: 0.5, stagger: 0.06, ease: "power2.out" }, 0.42);
    timeline.to([socialTitle, ...socialLinks].filter(Boolean), {
      opacity: 1,
      y: 0,
      duration: 0.45,
      stagger: 0.06,
      ease: "power3.out",
    }, 0.58);
    timelineRef.current = timeline;

    gsap.to(iconRef.current, { rotate: 225, duration: 0.55, ease: "power3.out", overwrite: "auto" });
    if (toggleRef.current && changeMenuColorOnOpen) {
      gsap.to(toggleRef.current, { color: openMenuButtonColor, duration: 0.25, overwrite: "auto" });
    }
  }, [changeMenuColorOnOpen, onMenuOpen, openMenuButtonColor]);

  const toggleMenu = () => {
    if (openRef.current) closeMenu();
    else openMenu();
  };

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        closeOnClickAway &&
        panelRef.current &&
        !panelRef.current.contains(target) &&
        !toggleRef.current?.contains(target)
      ) closeMenu();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [closeMenu, closeOnClickAway, open]);

  const handleItemClick = (event: React.MouseEvent<HTMLAnchorElement>, item: StaggeredMenuItem) => {
    event.preventDefault();
    closeMenu();
    window.setTimeout(() => onItemSelect?.(item), 340);
  };

  return (
    <div
      ref={wrapperRef}
      className={`${className} staggered-menu-wrapper${isFixed ? " fixed-wrapper" : ""}`}
      style={{ "--sm-accent": accentColor } as React.CSSProperties}
      data-position={position}
      data-open={open || undefined}
    >
      <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
        {colors.slice(0, 4).map((color, index) => (
          <div key={`${color}-${index}`} className="sm-prelayer" style={{ backgroundColor: color }} />
        ))}
      </div>

      <header className="staggered-menu-header" aria-label="Navigation controls">
        <GlassSurface
          width={144}
          height={48}
          borderRadius={999}
          borderWidth={0.12}
          brightness={20}
          opacity={0.9}
          blur={12}
          displace={2.4}
          backgroundOpacity={0.18}
          saturation={1.65}
          distortionScale={-180}
          greenOffset={12}
          blueOffset={24}
          className="sm-toggle-glass"
        >
          <button
            ref={toggleRef}
            className="sm-toggle"
            type="button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="staggered-menu-panel"
            onClick={toggleMenu}
          >
            <span>{open ? "Close" : "Menu"}</span>
            <span ref={iconRef} className="sm-icon" aria-hidden="true">
              <span className="sm-icon-line" />
              <span className="sm-icon-line sm-icon-line-v" />
            </span>
          </button>
        </GlassSurface>
      </header>

      <aside
        id="staggered-menu-panel"
        ref={panelRef}
        className="staggered-menu-panel"
        aria-hidden={!open}
        inert={!open}
      >
        <div className="sm-panel-inner">
          <p className="sm-panel-kicker">DIRECTORY / PORTFOLIO 2026</p>
          <nav aria-label="Portfolio sections">
            <ul className="sm-panel-list" data-numbering={displayItemNumbering || undefined}>
              {items.map((item, index) => (
                <StaggeredMenuRow
                  key={`${item.label}-${index}`}
                  item={item}
                  index={index}
                  numbering={displayItemNumbering}
                  open={open}
                  speed={marqueeSpeed}
                  onSelect={handleItemClick}
                />
              ))}
            </ul>
          </nav>
          {displaySocials && socialItems.length > 0 && (
            <div className="sm-socials">
              <h2 className="sm-socials-title">ELSEWHERE</h2>
              <ul className="sm-socials-list">
                {socialItems.map((social, index) => (
                  <li key={`${social.label}-${index}`}>
                    <a
                      href={social.link}
                      className="sm-socials-link"
                      target={social.link.startsWith("http") ? "_blank" : undefined}
                      rel={social.link.startsWith("http") ? "noreferrer" : undefined}
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}