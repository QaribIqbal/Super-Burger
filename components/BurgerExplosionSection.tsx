"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import BurgerAnimation from "./BurgerAnimation";
import styles from "./BurgerExplosionSection.module.css";

const CALLOUTS = [
  { id: "toastedBun", label: "Toasted sesame bun", progress: 0.2, side: "right" },
  { id: "twoPatties", label: "Two hand-formed patties", progress: 0.38, side: "right" },
  { id: "agedCheddar", label: "Melted aged cheddar", progress: 0.54, side: "left" },
  { id: "freshToppings", label: "Fresh-cut toppings", progress: 0.7, side: "right" },
] as const;

export default function BurgerExplosionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const scrollFrameRef = useRef<number | null>(null);

  const updateProgress = useCallback(() => {
    if (scrollFrameRef.current !== null) return;
    scrollFrameRef.current = window.requestAnimationFrame(() => {
      scrollFrameRef.current = null;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const scrollable = Math.max(section.offsetHeight - window.innerHeight, 1);
      setProgress(Math.max(0, Math.min(1, -rect.top / scrollable)));
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => {
      window.removeEventListener("scroll", updateProgress);
      if (scrollFrameRef.current !== null) window.cancelAnimationFrame(scrollFrameRef.current);
    };
  }, [updateProgress]);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    if (!section || !heading || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let animation: gsap.core.Tween | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      animation = gsap.fromTo(heading, { autoAlpha: 0, y: 28 }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.65,
        ease: "power3.out",
      });
      observer.disconnect();
    }, { threshold: 0.15 });

    observer.observe(section);
    return () => {
      observer.disconnect();
      animation?.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-its-made"
      className={styles.section}
      aria-labelledby="explosion-title"
    >
      <div className={styles.sticky}>
        <div ref={headingRef} className={styles.heading}>
          <span className={styles.eyebrow}>The build</span>
          <h2 id="explosion-title">Watch it come together.</h2>
          <p>Scroll through every layer. Nothing hidden, nothing hurried.</p>
        </div>

        <BurgerAnimation
          scrollProgress={progress}
          frameCount={119}
          frameDir="/images/burger-explosion/ezgif-frame-"
          canvasWidth={2560}
          canvasHeight={1440}
          loadWhenVisible
          preloadAll={false}
          maxConcurrentLoads={2}
          requestPriority="low"
        />

        {CALLOUTS.map((callout) => {
          const visible = Math.abs(progress - callout.progress) < 0.075;
          return (
            <div
              key={callout.label}
              className={`${styles.callout} ${styles[callout.side]} ${styles[callout.id]} ${visible ? styles.visible : ""}`}
              aria-hidden={!visible}
            >
              <span>{callout.label}</span>
            </div>
          );
        })}

        <div className={styles.progress} aria-hidden="true">
          <span>01</span>
          <div><i style={{ transform: `scaleX(${progress})` }} /></div>
          <span>04</span>
        </div>
        <p className={styles.hint}>Keep scrolling to build your burger</p>
      </div>
    </section>
  );
}
