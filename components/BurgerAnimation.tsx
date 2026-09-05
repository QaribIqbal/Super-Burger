"use client";

import * as React from "react";
import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import styles from "./Hero.module.css";

const FRAME_COUNT = 120;
const FRAME_DIR = "/images/ezgif-77b0809517093d5a-png-split/ezgif-frame-";
const CANVAS_W = 1080;
const CANVAS_H = 1920;

function frameUrl(i: number) {
  return `${FRAME_DIR}${String(i + 1).padStart(3, "0")}.png`;
}

interface BurgerAnimationProps {
  /** 0–1 scroll progress from the parent ScrollySection */
  scrollProgress: number;
  onLoadProgress?: (loaded: number, total: number) => void;
  onReady?: () => void;
}

const BurgerAnimation = forwardRef<HTMLCanvasElement, BurgerAnimationProps>(
  ({ scrollProgress, onLoadProgress, onReady }, ref) => {
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
      const frames: HTMLImageElement[] = new Array(FRAME_COUNT);
      loadedRef.current = 0;
      readyRef.current = false;

      const finish = () => {
        loadedRef.current += 1;
        onLoadProgress?.(loadedRef.current, FRAME_COUNT);
        if (loadedRef.current === FRAME_COUNT) {
          readyRef.current = true;
          onReady?.();
          // Draw the first frame immediately so there's no blank canvas
          drawFrame(0);
        }
      };

      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        img.decoding = "async";
        img.onload = finish;
        img.onerror = finish; // count errors so we don't get stuck
        img.src = frameUrl(i);
        frames[i] = img;
      }

      framesRef.current = frames;

      return () => {
        frames.forEach((img) => {
          img.onload = null;
          img.onerror = null;
        });
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ── Draw helper ─────────────────────────────────────────────────────── */
    function drawFrame(index: number) {
      const canvas = canvasRef.current;
      const img = framesRef.current[index];
      if (!canvas || !img?.complete || img.naturalWidth === 0) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.drawImage(img, 0, 0, CANVAS_W, CANVAS_H);
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ── Respond to scrollProgress prop ─────────────────────────────────── */
    useEffect(() => {
      const clamped = Math.max(0, Math.min(1, scrollProgress));
      // Map 0–1 to frame index 0–(FRAME_COUNT-1), with smooth interpolation
      const rawIndex = clamped * (FRAME_COUNT - 1);
      targetFrameRef.current = Math.round(rawIndex);
    }, [scrollProgress]);

    return (
      <div className={styles.canvasWrap}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          width={CANVAS_W}
          height={CANVAS_H}
          aria-hidden="true"
          role="presentation"
        />
      </div>
    );
  }
);

BurgerAnimation.displayName = "BurgerAnimation";
export default BurgerAnimation;