"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  menuItems,
  categories,
  getItemsByCategory,
  type MenuItem,
} from "@/lib/menu-data";

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState<MenuItem["category"] | null>(
    null
  );
  const [filter, setFilter] = useState<"spicy" | "veg" | "popular" | null>(null);

  const filteredItems = selectedCategory
    ? getItemsByCategory(selectedCategory).filter(
        (item) => !filter || item.tags?.includes(filter)
      )
    : menuItems;

  return (
    <section className="menu" aria-labelledby="menu-title">
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 1rem" }}>
        <header style={{ marginBottom: "3rem" }}>
          <h2 id="menu-title" style={{
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: "2rem",
            fontWeight: 400,
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
            color: "#2B1B12",
          }}>
            Menu
          </h2>
          <p style={{
            fontFamily: "Work Sans, sans-serif",
            fontSize: "0.875rem",
            color: "#2B1B12",
            opacity: 0.6,
          }}>
            Fresh ingredients, made to order
          </p>
        </header>

        <nav style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <button
              style={{
                fontFamily: "Work Sans, sans-serif",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: selectedCategory === null ? "#2B1B12" : "#B75A39",
                padding: "0.5rem 1rem",
                borderRadius: "9999px",
                border: selectedCategory === null ? "1px solid #B75A39" : "none",
                background: selectedCategory === null ? "transparent" : "#EEDABF",
                ...(selectedCategory === null && {
                  color: "#2B1B12",
                  borderColor: "#B75A39",
                  background: "transparent",
                }),
                ...(selectedCategory !== null && {
                  color: "#FBF3E3",
                  borderColor: "#B75A39",
                  background: "#B75A39",
                }),
                transition: "all 150ms ease",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
              onClick={() => setSelectedCategory(null)}
              aria-selected={!selectedCategory}
              aria-label="Show all categories"
            >
              All Items
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                style={{
                  fontFamily: "Work Sans, sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: selectedCategory === category.id
                    ? "#FBF3E3"
                    : "#2B1B12",
                  padding: "0.5rem 1rem",
                  borderRadius: "9999px",
                  border: selectedCategory === category.id
                    ? "1px solid #B75A39"
                    : "1px solid transparent",
                  background: selectedCategory === category.id
                    ? "#B75A39"
                    : "transparent",
                  ...(selectedCategory === category.id && {
                    color: "#FBF3E3",
                    borderColor: "#B75A39",
                    background: "#B75A39",
                  }),
                  ...(selectedCategory !== category.id && {
                    color: "#2B1B12",
                    borderColor: "transparent",
                    background: "transparent",
                  }),
                  transition: "all 150ms ease",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
                onClick={() => setSelectedCategory(category.id as MenuItem["category"])}
                aria-selected={selectedCategory === category.id}
                aria-label={`Show ${category.label} menu`}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <button
              style={{
                fontFamily: "Work Sans, sans-serif",
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "#2B1B12",
                padding: "0.25rem 0.5rem",
                borderRadius: "9999px",
                border: "1px solid #B75A39",
                background: "transparent",
                transition: "all 150ms ease",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
              onClick={() => setFilter("spicy")}
              aria-selected={filter === "spicy"}
              aria-label="Filter spicy items"
            >
              Spicy {filter === "spicy" ? "Active" : ""}
            </button>
            <button
              style={{
                fontFamily: "Work Sans, sans-serif",
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "#2B1B12",
                padding: "0.25rem 0.5rem",
                borderRadius: "9999px",
                border: "1px solid #B75A39",
                background: "transparent",
                transition: "all 150ms ease",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
              onClick={() => setFilter("veg")}
              aria-selected={filter === "veg"}
              aria-label="Filter vegetarian items"
            >
              Veg {filter === "veg" ? "Active" : ""}
            </button>
            <button
              style={{
                fontFamily: "Work Sans, sans-serif",
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "#2B1B12",
                padding: "0.25rem 0.5rem",
                borderRadius: "9999px",
                border: "1px solid #B75A39",
                background: "transparent",
                transition: "all 150ms ease",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
              onClick={() => setFilter("popular")}
              aria-selected={filter === "popular"}
              aria-label="Filter popular items"
            >
              Popular {filter === "popular" ? "Active" : ""}
            </button>
          </div>
        </nav>

        <div style={{ display: "grid", gap: "1.5rem" }}>
          {filteredItems.map((item) => (
            <article
              key={item.id}
              style={{
                background: "#FBF3E3",
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(43, 27, 18, 0.12)",
                transition: "transform 150ms ease, box-shadow 150ms ease",
              }}
            >
              <div style={{ position: "relative", aspectRatio: "4 / 3", background: "#B75A39" }}>
                <Image
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div style={{ padding: "1rem" }}>
                <h3 style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: "1rem",
                  fontWeight: 400,
                  textTransform: "uppercase",
                  color: "#2B1B12",
                  marginBottom: "0.25rem",
                }}>
                  {item.name}
                </h3>
                <p style={{
                  fontFamily: "Work Sans, sans-serif",
                  fontSize: "0.75rem",
                  lineHeight: 1.5,
                  color: "#2B1B12",
                  opacity: 0.7,
                  marginBottom: "0.75rem",
                }}>
                  {item.description}
                </p>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {item.tags?.map((tag) => {
                    if (tag === "spicy") {
                      return (
                        <span
                          style={{
                            fontFamily: "Work Sans, sans-serif",
                            fontSize: "0.625rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "9999px",
                            background: "#B75A39",
                            color: "#FBF3E3",
                          }}
                        >
                          {tag}
                        </span>
                      );
                    }
                    if (tag === "veg") {
                      return (
                        <span
                          style={{
                            fontFamily: "Work Sans, sans-serif",
                            fontSize: "0.625rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "9999px",
                            background: "#2B1B12",
                            color: "#FBF3E3",
                          }}
                        >
                          {tag}
                        </span>
                      );
                    }
                    if (tag === "popular") {
                      return (
                        <span
                          style={{
                            fontFamily: "Work Sans, sans-serif",
                            fontSize: "0.625rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "9999px",
                            background: "#F2A93B",
                            color: "#2B1B12",
                          }}
                        >
                          {tag}
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "1rem", color: "#B75A39" }}>
                  ${item.price.toFixed(2)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}