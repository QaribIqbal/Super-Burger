"use client";

import * as React from "react";
import { useRef, useState, useEffect, useCallback } from "react";
import BurgerAnimation from "./BurgerAnimation";
import ScrollyCopy from "./ScrollyCopy";
import { getHeroLoaderState } from "@/lib/heroLoader.mjs";
import styles from "./Hero.module.css";

const TRACK_HEIGHT_VH = 400;
// Keep the initial request small; the frame loader prefetches the current
// scroll neighborhood as the user moves through the sequence.
const READY_FRAME_COUNT = 8;
const MAX_CONCURRENT_LOADS = 6;

export default function ScrollySection() {
  const trackRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [loadedFrames, setLoadedFrames] = useState(0);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const scrollFrameRef = useRef<number | null>(null);

  /* ── Scroll → progress mapping ──────────────────────────────────────── */
  const handleScroll = useCallback(() => {
    if (scrollFrameRef.current !== null) return;
    scrollFrameRef.current = window.requestAnimationFrame(() => {
      scrollFrameRef.current = null;
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
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // set initial value
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollFrameRef.current !== null) window.cancelAnimationFrame(scrollFrameRef.current);
    };
  }, [handleScroll]);

  // Unlock scrolling as soon as the first frame renders — no need to hold the
  // user hostage while the remaining 278 frames stream in the background.
  useEffect(() => {
    if (firstFrameReady) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [firstFrameReady]);

  /* ── Loader ──────────────────────────────────────────────────────────── */
  // Progress tracks only the critical opening frames, not the full sequence.
  const loaderState = getHeroLoaderState(
    Math.min(loadedFrames, READY_FRAME_COUNT),
    READY_FRAME_COUNT,
    heroReady,
  );
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
          onFirstFrameReady={() => setFirstFrameReady(true)}
          onReady={() => setHeroReady(true)}
          preloadAll={false}
          readyFrameCount={READY_FRAME_COUNT}
          maxConcurrentLoads={MAX_CONCURRENT_LOADS}
        />

        {/* ── Loading overlay ───────────────────────────────────────────── */}
        <div
          className={[
            styles.loader,
            loaderState.visible ? "" : styles["loader--hidden"],
          ]
            .filter(Boolean)
            .join(" ")}
          aria-hidden={!loaderState.visible}
          role="status"
          aria-label={`${loaderState.label}: ${loaderState.percent}%`}
        >
          <div className={styles.loaderBrand} aria-hidden="true">
            <span className={styles.loaderBrandScript}>Super</span>
            <span className={styles.loaderBrandBold}>Burger Co.</span>
          </div>
          <span className={styles.loaderLabel}>{loaderState.label}</span>
          <span className={styles.loaderSubtext}>Loading every layer for a smooth scroll</span>
          <div className={styles.loaderBar}>
            <div
              className={styles.loaderFill}
              style={{ width: `${loaderState.percent}%` }}
            />
          </div>
          <span className={styles.loaderProgress}>{loaderState.percent}%</span>
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
