"use client";

import * as React from "react";
import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { buildFrameAssetUrl, FRAME_ASSET_VERSION } from "@/lib/frameAssets.mjs";
import {
  createSparseFrameOrder,
  findNearestLoadedFrame,
  prioritizeFrameNeighborhood,
} from "@/lib/frameLoading.mjs";
import styles from "./Hero.module.css";

const DEFAULT_FRAME_COUNT = 299;
const DEFAULT_FRAME_DIR = "/images/burger-build/frame-";
const DEFAULT_CANVAS_W = 2560;
const DEFAULT_CANVAS_H = 1440;
const ACTIVE_LOADS = 6;
const NEIGHBOR_RADIUS = 7;
const KEYFRAME_STRIDE = 18;
type FrameStatus = "idle" | "queued" | "loading" | "loaded" | "error";

interface BurgerAnimationProps {
  /** 0–1 scroll progress from the parent ScrollySection */
  scrollProgress: number;
  onLoadProgress?: (loaded: number, total: number) => void;
  onFirstFrameReady?: () => void;
  onReady?: () => void;
  frameCount?: number;
  frameDir?: string;
  canvasWidth?: number;
  canvasHeight?: number;
  loadWhenVisible?: boolean;
  assetVersion?: string;
}

const BurgerAnimation = forwardRef<HTMLCanvasElement, BurgerAnimationProps>(
  ({ scrollProgress, onLoadProgress, onFirstFrameReady, onReady, frameCount = DEFAULT_FRAME_COUNT, frameDir = DEFAULT_FRAME_DIR, canvasWidth = DEFAULT_CANVAS_W, canvasHeight = DEFAULT_CANVAS_H, loadWhenVisible = false, assetVersion = FRAME_ASSET_VERSION }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    // Forward the ref so parent can measure it if needed
    useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement);

    const framesRef = useRef<HTMLImageElement[]>([]);
    const loadedRef = useRef(0);
    const currentFrameRef = useRef(-1);
    const targetFrameRef = useRef(0);
    const statusRef = useRef<FrameStatus[]>([]);
    const queueRef = useRef<number[]>([]);
    const activeLoadsRef = useRef(0);
    const startedRef = useRef(false);
    const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pumpRef = useRef<(() => void) | null>(null);

    /* Keep the closest loaded frame visible until the exact target is ready. */
    const drawFrame = React.useCallback((index: number) => {
      const canvas = canvasRef.current;
      const frames = framesRef.current;
      const drawableIndex = findNearestLoadedFrame(index, statusRef.current);
      if (drawableIndex === null || drawableIndex === currentFrameRef.current) return;
      const img = frames[drawableIndex];
      if (!canvas || !img) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
      currentFrameRef.current = drawableIndex;
    }, [canvasHeight, canvasWidth]);

    /* ── Progressive frame loader ─────────────────────────────────────────── */
    useEffect(() => {
      const frames: HTMLImageElement[] = new Array(frameCount);
      framesRef.current = frames;
      const statuses: FrameStatus[] = new Array(frameCount).fill("idle");
      loadedRef.current = 0;
      statusRef.current = statuses;
      queueRef.current = [];
      activeLoadsRef.current = 0;
      startedRef.current = false;

      const enqueue = (index: number, priority = false) => {
        if (index < 0 || index >= frameCount || statuses[index] !== "idle") return;
        statuses[index] = "queued";
        if (priority) queueRef.current.unshift(index);
        else queueRef.current.push(index);
      };

      const pump = () => {
        while (activeLoadsRef.current < ACTIVE_LOADS && queueRef.current.length > 0) {
          const index = queueRef.current.shift();
          if (index === undefined) break;
          if (statuses[index] !== "queued") continue;
          statuses[index] = "loading";
          activeLoadsRef.current += 1;
          const img = new Image();
          img.decoding = "async";
          img.fetchPriority = index === 0 || Math.abs(index - targetFrameRef.current) <= NEIGHBOR_RADIUS
            ? "high"
            : "low";
          img.onload = () => {
            statuses[index] = "loaded";
            activeLoadsRef.current -= 1;
            loadedRef.current += 1;
            onLoadProgress?.(loadedRef.current, frameCount);
            if (index === 0) {
              drawFrame(0);
              onFirstFrameReady?.();
            } else {
              drawFrame(targetFrameRef.current);
            }
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
          img.src = buildFrameAssetUrl(frameDir, index, assetVersion);
          frames[index] = img;
        }
      };
      pumpRef.current = pump;

      const start = () => {
        if (startedRef.current) return;
        startedRef.current = true;

        // Make the opening render useful immediately.
        for (let index = 0; index < Math.min(8, frameCount); index += 1) enqueue(index, index === 0);
        pump();

        // Load a sparse set of keyframes for useful coverage. Exact frames are
        // fetched on demand as the visitor scrolls instead of downloading the
        // entire 500+ MB sequence at startup.
        loadTimeoutRef.current = setTimeout(() => {
          for (const index of createSparseFrameOrder(frameCount, KEYFRAME_STRIDE)) enqueue(index);
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

    /* ── Respond to scrollProgress prop ─────────────────────────────────── */
    useEffect(() => {
      const clamped = Math.max(0, Math.min(1, scrollProgress));
      // Map 0–1 to frame index 0–(frameCount-1), with smooth interpolation
      const rawIndex = clamped * (frameCount - 1);
      const target = Math.round(rawIndex);
      targetFrameRef.current = target;
      prioritizeFrameNeighborhood(
        queueRef.current,
        statusRef.current,
        target,
        frameCount,
        NEIGHBOR_RADIUS,
      );
      pumpRef.current?.();
      drawFrame(target);
    }, [drawFrame, scrollProgress, frameCount]);

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
