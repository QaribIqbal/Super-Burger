"use client";

import * as React from "react";
import styles from "./Hero.module.css";

type Alignment = "left" | "right" | "center";

interface CopyPanelProps {
  /** Whether this panel should be visible */
  visible: boolean;
  alignment: Alignment;
  children: React.ReactNode;
}

export default function CopyPanel({
  visible,
  alignment,
  children,
}: CopyPanelProps) {
  const alignClass =
    alignment === "left"
      ? styles["panel--left"]
      : alignment === "right"
        ? styles["panel--right"]
        : styles["panel--center"];

  return (
    <div
      className={[
        styles.panel,
        alignClass,
        visible ? styles["panel--visible"] : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden={!visible}
    >
      {children}
    </div>
  );
}
