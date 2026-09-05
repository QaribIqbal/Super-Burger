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
}

const BurgerAnimation = forwardRef<HTMLCanvasElement, BurgerAnimationProps>(
  ({ scrollProgress, onLoadProgress, onReady, frameCount = DEFAULT_FRAME_COUNT, frameDir = DEFAULT_FRAME_DIR, canvasWidth = DEFAULT_CANVAS_W, canvasHeight = DEFAULT_CANVAS_H }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // Forward the ref so parent can measure it if needed
    useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement);

    const framesRef = useRef<HTMLImageElement[]>([]);
    const loadedRef = useRef(0);
    const readyRef = useRef(false);
    const rafRef = useRef<number>(0);
    const currentFrameRef = useRef(-1);
    const targetFrameRef = useRef(0);

    /* ── Pre-load all frames ─────────────────────────────────────────────── */
    useEffect(() => {
      const frames: HTMLImageElement[] = new Array(frameCount);
      loadedRef.current = 0;
      readyRef.current = false;

      const finish = () => {
        loadedRef.current += 1;
        onLoadProgress?.(loadedRef.current, frameCount);
        if (loadedRef.current === frameCount) {
          readyRef.current = true;
          onReady?.();
          // Draw the first frame immediately so there's no blank canvas
          drawFrame(0);
        }
      };

      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          if (i === 0) drawFrame(0);
          finish();
        };
        img.onerror = finish; // count errors so we don't get stuck
        img.src = `${frameDir}${String(i + 1).padStart(3, "0")}.png`;
        frames[i] = img;
      }

      framesRef.current = frames;

      return () => {
        frames.forEach((img) => {
          img.onload = null;
          img.onerror = null;
        });
      };
    // The callbacks and frame source are intentionally captured once for the lifetime of the preload.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ── Draw helper ─────────────────────────────────────────────────────── */
    function drawFrame(index: number) {
      const canvas = canvasRef.current;
      const img = framesRef.current[index] || framesRef.current[0];
      if (!canvas || !img?.complete || img.naturalWidth === 0) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
      currentFrameRef.current = index;
    }

    /* ── rAF render loop — only re-draws when frame changes ─────────────── */
    useEffect(() => {
      function loop() {
        if (readyRef.current && targetFrameRef.current !== currentFrameRef.current) {
          drawFrame(targetFrameRef.current);
        }
        rafRef.current = requestAnimationFrame(loop);
      }
      rafRef.current = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(rafRef.current);
    }, []);

    /* ── Respond to scrollProgress prop ─────────────────────────────────── */
    useEffect(() => {
      const clamped = Math.max(0, Math.min(1, scrollProgress));
      // Map 0–1 to frame index 0–(frameCount-1), with smooth interpolation
      const rawIndex = clamped * (frameCount - 1);
      targetFrameRef.current = Math.round(rawIndex);
    }, [scrollProgress]);

    return (
      <div className={styles.canvasWrap}>
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
