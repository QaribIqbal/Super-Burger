"use client";

import * as React from "react";
import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import styles from "./Hero.module.css";

const DEFAULT_FRAME_COUNT = 299;
const DEFAULT_FRAME_DIR = "/images/burger-build/frame-";
const DEFAULT_CANVAS_W = 2560;
const DEFAULT_CANVAS_H = 1440;

interface BurgerAnimationProps {
  /** 0–1 scroll progress from the parent ScrollySection */
  scrollProgress: number;
  onLoadProgress?: (loaded: number, total: number) => void;
  onReady?: () => void;
  frameCount?: number;
  frameDir?: string;
  canvasWidth?: number;
  canvasHeight?: number;
  loadWhenVisible?: boolean;
}

const BurgerAnimation = forwardRef<HTMLCanvasElement, BurgerAnimationProps>(
  ({ scrollProgress, onLoadProgress, onReady, frameCount = DEFAULT_FRAME_COUNT, frameDir = DEFAULT_FRAME_DIR, canvasWidth = DEFAULT_CANVAS_W, canvasHeight = DEFAULT_CANVAS_H, loadWhenVisible = false }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    // Forward the ref so parent can measure it if needed
    useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement);

    const framesRef = useRef<HTMLImageElement[]>([]);
    const loadedRef = useRef(0);
    const rafRef = useRef<number>(0);
    const currentFrameRef = useRef(-1);
    const targetFrameRef = useRef(0);
    const statusRef = useRef<Array<"idle" | "loading" | "loaded" | "error">>([]);
    const queueRef = useRef<number[]>([]);
    const activeLoadsRef = useRef(0);
    const startedRef = useRef(false);
    const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pumpRef = useRef<(() => void) | null>(null);

    /* Draw the best available frame while the rest of the sequence loads. */
    const drawFrame = React.useCallback((index: number) => {
      const canvas = canvasRef.current;
      const frames = framesRef.current;
      const img = frames[index]?.complete && frames[index]?.naturalWidth
        ? frames[index]
        : frames.find((candidate) => candidate.complete && candidate.naturalWidth > 0);
      if (!canvas || !img) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
      currentFrameRef.current = index;
    }, [canvasHeight, canvasWidth]);

    /* ── Progressive frame loader ─────────────────────────────────────────── */
    useEffect(() => {
      const frames: HTMLImageElement[] = new Array(frameCount);
      const statuses: Array<"idle" | "loading" | "loaded" | "error"> = new Array(frameCount).fill("idle");
      loadedRef.current = 0;
      statusRef.current = statuses;
      queueRef.current = [];
      activeLoadsRef.current = 0;
      startedRef.current = false;

      const concurrency = 6;
      const enqueue = (index: number, priority = false) => {
        if (index < 0 || index >= frameCount || statuses[index] !== "idle") return;
        statuses[index] = "loading";
        if (priority) queueRef.current.unshift(index);
        else queueRef.current.push(index);
      };

      const pump = () => {
        while (activeLoadsRef.current < concurrency && queueRef.current.length > 0) {
          const index = queueRef.current.shift();
          if (index === undefined) break;
          activeLoadsRef.current += 1;
          const img = new Image();
          img.decoding = "async";
          img.fetchPriority = index === 0 ? "high" : "low";
          img.onload = () => {
            statuses[index] = "loaded";
            activeLoadsRef.current -= 1;
            loadedRef.current += 1;
            onLoadProgress?.(loadedRef.current, frameCount);
            if (index === 0 || targetFrameRef.current === index) drawFrame(index);
            if (loadedRef.current === frameCount) onReady?.();
            pump();
          };
          img.onerror = () => {
            statuses[index] = "error";
            activeLoadsRef.current -= 1;
            loadedRef.current += 1;
            onLoadProgress?.(loadedRef.current, frameCount);
            pump();
          };
          img.src = `${frameDir}${String(index + 1).padStart(3, "0")}.png`;
          frames[index] = img;
        }
      };
      pumpRef.current = pump;

      const start = () => {
        if (startedRef.current) return;
        startedRef.current = true;

        // Make the opening render useful immediately; the rest is background work.
        for (let index = 0; index < Math.min(8, frameCount); index += 1) enqueue(index, index === 0);
        pump();

        // Keep first paint responsive; the remainder begins just after the initial burst.
        loadTimeoutRef.current = setTimeout(() => {
          for (let index = 8; index < frameCount; index += 1) enqueue(index);
          pump();
        }, 250);
      };

      if (loadWhenVisible) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              start();
              observer.disconnect();
            }
          },
          { rootMargin: "1200px 0px" },
        );
        if (wrapperRef.current) observer.observe(wrapperRef.current);
        return () => {
          observer.disconnect();
          if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
          frames.forEach((img) => {
            if (img) {
              img.onload = null;
              img.onerror = null;
            }
          });
          pumpRef.current = null;
        };
      }

      framesRef.current = frames;
      start();

      return () => {
        frames.forEach((img) => {
          if (img) {
            img.onload = null;
            img.onerror = null;
          }
        });
        if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
        pumpRef.current = null;
      };
    // The callbacks and frame source are intentionally captured once for the lifetime of the preload.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [drawFrame]);

    /* ── rAF render loop — only re-draws when frame changes ─────────────── */
    useEffect(() => {
      function loop() {
        if (targetFrameRef.current !== currentFrameRef.current) {
          drawFrame(targetFrameRef.current);
        }
        rafRef.current = requestAnimationFrame(loop);
      }
      rafRef.current = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(rafRef.current);
    }, [drawFrame]);

    /* ── Respond to scrollProgress prop ─────────────────────────────────── */
    useEffect(() => {
      const clamped = Math.max(0, Math.min(1, scrollProgress));
      // Map 0–1 to frame index 0–(frameCount-1), with smooth interpolation
      const rawIndex = clamped * (frameCount - 1);
      targetFrameRef.current = Math.round(rawIndex);
      const target = Math.round(rawIndex);
      const targetStatus = statusRef.current[target];
      if (targetStatus === "idle") {
        statusRef.current[target] = "loading";
        queueRef.current.unshift(target);
        pumpRef.current?.();
      }
    }, [scrollProgress, frameCount]);

    return (
      <div ref={wrapperRef} className={styles.canvasWrap}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          width={canvasWidth}
          height={canvasHeight}
          aria-hidden="true"
          role="presentation"
        />
      </div>
    );
  }
);

BurgerAnimation.displayName = "BurgerAnimation";
export default BurgerAnimation;
