"use client";

import * as React from "react";
import Link from "next/link";
import CopyPanel from "./CopyPanel";
import styles from "./Hero.module.css";
import { ORDER_URL, DELIVERY_PROMISE, CURRENT_OFFER } from "@/lib/config";

// Beat boundaries (scroll progress 0–1)
const BEATS = {
  intro: [0, 0.18],
  build: [0.15, 0.42],
  ingredients: [0.38, 0.67],
  sear: [0.63, 0.86],
  cta: [0.83, 1.0],
} as const;

function inRange(progress: number, range: readonly [number, number]): boolean {
  return progress >= range[0] && progress <= range[1];
}

interface ScrollyCopyProps {
  scrollProgress: number;
}

export default function ScrollyCopy({ scrollProgress }: ScrollyCopyProps) {
  const p = scrollProgress;

  return (
    <div className={styles.copyLayer} aria-live="polite">
      {/* ── Beat 1: Hero / Intro (0–18%) ─────────────────────────────────── */}
      <CopyPanel visible={inRange(p, BEATS.intro)} alignment="left">
        <span className={styles.accent}>Super</span>
        <h1 className={styles.headline}>
          Delicious,
          <br />
          Built Right
        </h1>
        <p className={styles.body}>
          Fresh-grilled, double-stacked, made to order — every single time.
        </p>
      </CopyPanel>

      {/* ── Beat 2: The Build (15–42%) ────────────────────────────────────── */}
      <CopyPanel visible={inRange(p, BEATS.build)} alignment="left">
        <h2 className={styles.headline}>
          Built layer
          <br />
          by layer.
        </h2>
        <span className={styles.bodyPoint}>
          A toasted sesame bun, baked fresh each morning.
        </span>
        <span className={styles.bodyPoint}>
          Real cheddar, melted right at the flame — not microwaved on.
        </span>
      </CopyPanel>

      {/* ── Beat 3: What Goes In (38–67%) ────────────────────────────────── */}
      <CopyPanel visible={inRange(p, BEATS.ingredients)} alignment="right">
        <h2 className={styles.headline}>
          Only what
          <br />
          belongs.
        </h2>
        <span className={styles.bodyPoint}>
          Hand-sliced tomato and onion, cut same-day.
        </span>
        <span className={styles.bodyPoint}>
          Crisp lettuce — no wilted shortcuts.
        </span>
        <span className={styles.bodyPoint}>Pickles with real bite.</span>
      </CopyPanel>

      {/* ── Beat 4: The Sear (63–86%) ─────────────────────────────────────── */}
      <CopyPanel visible={inRange(p, BEATS.sear)} alignment="left">
        <h2 className={styles.headline}>
          Seared,
          <br />
          not steamed.
        </h2>
        <p className={styles.body}>
          Two hand-formed patties, grilled hot and fast for a real crust —
          because that&apos;s where the flavor lives.
        </p>
      </CopyPanel>

      {/* ── Beat 5: Reassembly & CTA (83–100%) ───────────────────────────── */}
      <CopyPanel visible={inRange(p, BEATS.cta)} alignment="center">
        <h2 className={styles.headline}>
          Stacked.
          <br />
          Ready. Yours.
        </h2>
        <p className={styles.body} style={{ textAlign: "center" }}>
          Super Burger Co. — fresh burgers, done properly.
        </p>

        <div className={styles.ctaGroup}>
          <a
            href={ORDER_URL}
            className={styles.ctaPrimary}
            aria-label="Order Now — opens ordering system"
          >
            Order Now
          </a>
          <Link href="/menu" className={styles.ctaSecondary}>
            See Full Menu
          </Link>
          <div className={styles.badges} role="list" aria-label="Current offers">
            <span className={styles.badge} role="listitem">
              {DELIVERY_PROMISE}
            </span>
            <span className={styles.badge} role="listitem">
              {CURRENT_OFFER}
            </span>
          </div>
        </div>
      </CopyPanel>
    </div>
  );
}
