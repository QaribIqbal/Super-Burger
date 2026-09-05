import * as React from "react";

export default function FinalCTA() {
  return (
    <section id="order" style={{
      position: "relative",
      padding: "4rem 1rem",
      background: "var(--color-rust)",
      color: "var(--color-cream-text)",
      overflow: "hidden",
    }} aria-labelledby="final-cta-headline">
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 1rem", position: "relative" }}>
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, var(--color-rust) 0%, transparent 100%)",
          pointerEvents: "none",
        }}>
        </div>
        <header style={{
          textAlign: "center",
          marginBottom: "1.5rem",
        }}>
          <h2 id="final-cta-headline" style={{
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: "2rem",
            fontWeight: 400,
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
            color: "var(--color-cream-text)",
            marginBottom: "0.5rem",
          }}>
            Order Now
          </h2>
          <p style={{
            fontFamily: "Work Sans, sans-serif",
            fontSize: "1rem",
            opacity: 0.8,
            marginBottom: "2rem",
          }}>
            Delivery or pickup. Fresh from the grill to your door.
          </p>
        </header>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 280,
          padding: "0.5rem 1.25rem",
          fontFamily: "Work Sans, sans-serif",
          fontSize: "1rem",
          fontWeight: 600,
          color: "var(--color-cream-text)",
          background: "#2B1B12",
          borderRadius: "9999px",
          textDecoration: "none",
          transition: "background 150ms ease",
        }}>
          <a href="https://order.example.com" target="_blank" rel="noopener noreferrer">
            Place My Order
          </a>
        </div>
      </div>
    </section>
  );
}