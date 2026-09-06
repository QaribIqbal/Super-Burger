"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import BurgerAnimation from "./BurgerAnimation";
import styles from "./BurgerExplosionSection.module.css";

const CALLOUTS = [
  { label: "Toasted sesame bun", progress: 0.2, side: "left" },
  { label: "Two hand-formed patties", progress: 0.38, side: "right" },
  { label: "Melted aged cheddar", progress: 0.54, side: "left" },
  { label: "Fresh-cut toppings", progress: 0.7, side: "right" },
] as const;

export default function BurgerExplosionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  const updateProgress = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const scrollable = Math.max(section.offsetHeight - window.innerHeight, 1);
    setProgress(Math.max(0, Math.min(1, -rect.top / scrollable)));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, [updateProgress]);

  return (
    <section
      ref={sectionRef}
      id="how-its-made"
      className={styles.section}
      aria-labelledby="explosion-title"
    >
      <div className={styles.sticky}>
        <div className={styles.heading}>
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
        />

        {CALLOUTS.map((callout) => {
          const visible = Math.abs(progress - callout.progress) < 0.075;
          return (
            <div
              key={callout.label}
              className={`${styles.callout} ${styles[callout.side]} ${callout.label === "Fresh-cut toppings" ? styles.freshToppings : ""} ${visible ? styles.visible : ""}`}
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
