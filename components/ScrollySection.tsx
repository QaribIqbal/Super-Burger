"use client";

import * as React from "react";
import { useRef, useState, useEffect, useCallback } from "react";
import BurgerAnimation from "./BurgerAnimation";
import ScrollyCopy from "./ScrollyCopy";
import styles from "./Hero.module.css";

const TRACK_HEIGHT_VH = 400;

export default function ScrollySection() {
  const trackRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [loadedFrames, setLoadedFrames] = useState(0);

  /* ── Scroll → progress mapping ──────────────────────────────────────── */
  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const trackH = track.offsetHeight;
    const viewportH = window.innerHeight;

    // scrolled: how many px of the track have passed above the viewport top
    // 0 when track top is at viewport top, trackH - viewportH when track bottom is at viewport bottom
    const scrolled = -rect.top;
    const scrollable = trackH - viewportH;

    const progress = Math.max(0, Math.min(1, scrolled / scrollable));
    setScrollProgress(progress);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // set initial value
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  /* ── Loader ──────────────────────────────────────────────────────────── */
  const loadPercent = Math.round((loadedFrames / 119) * 100);
  const firstFrameReady = loadedFrames > 0;

  /* ── Ghost text visibility (only during beat 1) ──────────────────────── */
  const showGhost = scrollProgress < 0.2;

  /* ── Scroll hint (only when progress is near 0) ──────────────────────── */
  const showScrollHint = scrollProgress < 0.05 && firstFrameReady;

  return (
    <section
      ref={trackRef}
      aria-label="Signature burger showcase"
      style={{ height: `${TRACK_HEIGHT_VH}vh` }}
      id="hero-build"
    >
      <div className={styles.sticky}>
        {/* ── Split cream / rust background ─────────────────────────────── */}
        <div className={styles.background} aria-hidden="true" />

        {/* ── Ghost oversized "BURGER" wordmark (beat 1 only) ───────────── */}
        <div
          className={[
            styles.ghostText,
            showGhost ? "" : styles["ghostText--hidden"],
          ]
            .filter(Boolean)
            .join(" ")}
          aria-hidden="true"
        >
          <span className={styles.ghostTextInner}>BURGER</span>
        </div>

        {/* ── Canvas animation ──────────────────────────────────────────── */}
        <BurgerAnimation
          scrollProgress={scrollProgress}
          onLoadProgress={(loaded) => setLoadedFrames(loaded)}
        />

        {/* ── Loading overlay ───────────────────────────────────────────── */}
        <div
          className={[
            styles.loader,
            firstFrameReady ? styles["loader--hidden"] : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-hidden={firstFrameReady}
          role="status"
          aria-label={`Loading burger: ${loadPercent}%`}
        >
          <span className={styles.loaderLabel}>Loading&hellip;</span>
          <div className={styles.loaderBar}>
            <div
              className={styles.loaderFill}
              style={{ width: `${loadPercent}%` }}
            />
          </div>
        </div>

        {/* ── Copywriting panels (5 beats) ──────────────────────────────── */}
        <ScrollyCopy scrollProgress={scrollProgress} />

        {/* ── Scroll-down hint ──────────────────────────────────────────── */}
        <div
          className={[
            styles.scrollHint,
            showScrollHint ? "" : styles["scrollHint--hidden"],
          ]
            .filter(Boolean)
            .join(" ")}
          aria-hidden="true"
        >
          <span className={styles.scrollHintLabel}>Scroll</span>
          <div className={styles.scrollHintArrow} />
        </div>
      </div>
    </section>
  );
}
