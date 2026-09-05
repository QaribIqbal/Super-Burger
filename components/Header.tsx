"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { NAV_LINKS, ORDER_URL } from "@/lib/config";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "var(--header-height)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(1.5rem, 6vw, 6.25rem)",
        background: scrolled
          ? "rgba(239, 223, 192, 0.85)"
          : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        transition:
          "background var(--transition-slow), backdrop-filter var(--transition-slow)",
        borderBottom: scrolled
          ? "1px solid rgba(43, 27, 18, 0.08)"
          : "1px solid transparent",
      }}
      role="banner"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "var(--max-width)",
          margin: "0 auto",
        }}
      >
        {/* Wordmark */}
        <Link
          href="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "baseline",
            gap: "0.25rem",
            flexShrink: 0,
          }}
          aria-label="Super Burger Co. — home"
        >
          <span
            style={{
              fontFamily: "var(--font-caveat), Caveat, cursive",
              fontSize: "1.4rem",
              fontWeight: 600,
              color: "var(--color-rust)",
              lineHeight: 1,
            }}
          >
            Super
          </span>
          <span
            style={{
              fontFamily:
                "var(--font-archivo-black), 'Archivo Black', sans-serif",
              fontSize: "0.875rem",
              fontWeight: 400,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--color-ink)",
              lineHeight: 1,
            }}
          >
            Burger Co.
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          id="main-navigation"
          className="desktop-nav"
          aria-label="Primary navigation"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-xl)",
          }}
        >
          <ul
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-xl)",
              listStyle: "none",
            }}
          >
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontFamily: "var(--font-work-sans), 'Work Sans', sans-serif",
                    fontSize: "var(--text-sm)",
                    fontWeight: 500,
                    color: "var(--color-ink)",
                    textDecoration: "none",
                    opacity: 0.8,
                    transition: "opacity var(--transition-fast)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.opacity = "0.8";
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA button — rust → gold gradient */}
          <a
            href={ORDER_URL}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.5rem 1.375rem",
              fontFamily: "var(--font-work-sans), 'Work Sans', sans-serif",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              color: "var(--color-cream-text)",
              background:
                "linear-gradient(100deg, var(--color-rust) 0%, var(--color-accent-gold) 100%)",
              borderRadius: "var(--radius-full)",
              textDecoration: "none",
              letterSpacing: "0.02em",
              transition:
                "opacity var(--transition-fast), box-shadow var(--transition-fast)",
              boxShadow: "0 2px 12px rgba(193, 68, 14, 0.3)",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.opacity = "0.9";
              el.style.boxShadow = "0 4px 20px rgba(193, 68, 14, 0.5)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.opacity = "1";
              el.style.boxShadow = "0 2px 12px rgba(193, 68, 14, 0.3)";
            }}
          >
            Order Now
          </a>
        </nav>

        {/* Mobile hamburger — hidden on desktop via CSS */}
        <button
          className="mobile-menu-toggle"
          style={{
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
            borderRadius: "var(--radius-md)",
            background: "transparent",
            color: "var(--color-ink)",
            transition: "background var(--transition-fast)",
            flexShrink: 0,
          }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="main-navigation"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width={24}
              height={24}
              aria-hidden="true"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width={24}
              height={24}
              aria-hidden="true"
            >
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          style={{
            position: "fixed",
            top: "var(--header-height)",
            left: 0,
            right: 0,
            background: "rgba(239, 223, 192, 0.97)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            padding: "var(--space-xl) var(--space-2xl)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-lg)",
            borderBottom: "1px solid rgba(43, 27, 18, 0.1)",
            zIndex: 199,
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily:
                  "var(--font-archivo-black), 'Archivo Black', sans-serif",
                fontSize: "var(--text-lg)",
                fontWeight: 400,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                color: "var(--color-ink)",
                textDecoration: "none",
              }}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={ORDER_URL}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.75rem 2rem",
              fontFamily: "var(--font-work-sans), 'Work Sans', sans-serif",
              fontSize: "var(--text-base)",
              fontWeight: 600,
              color: "var(--color-cream-text)",
              background:
                "linear-gradient(100deg, var(--color-rust) 0%, var(--color-accent-gold) 100%)",
              borderRadius: "var(--radius-full)",
              textDecoration: "none",
              marginTop: "var(--space-sm)",
              alignSelf: "flex-start",
            }}
          >
            Order Now
          </a>
        </nav>
      )}
    </header>
  );
}