export default function USP() {
  return (
    <section id="why-order" style={{
      padding: "4rem 1rem",
      background: "var(--color-cream)",
    }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 1rem" }}>
        <header style={{
          marginBottom: "3rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}>
          <h2 id="usp-title" style={{
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: "2rem",
            fontWeight: 400,
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
            color: "#2B1B12",
          }}>
            Why People Order From Us
          </h2>
          <p style={{
            fontFamily: "Work Sans, sans-serif",
            fontSize: "0.875rem",
            color: "#2B1B12",
            opacity: 0.6,
          }}>
            Over 5,000 satisfied customers since 2018
          </p>
        </header>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "2rem",
        }}>
          <div style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "1.5rem",
            padding: "1.5rem",
            borderRadius: 8,
            background: "var(--color-cream-text)",
            transition: "transform 250ms ease, box-shadow 250ms ease",
          }}>
            <div style={{
              flexShrink: 0,
              width: 48,
              height: 48,
              borderRadius: "9999px",
              background: "#B75A39",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M13 2L3 14h9l-1 6 9-12h-9l1-6z" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{
                fontFamily: "Work Sans, sans-serif",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#2B1B12",
                marginBottom: "0.25rem",
              }}>
                Grilled Fresh Daily
              </p>
              <p style={{
                fontFamily: "Work Sans, sans-serif",
                fontSize: "0.75rem",
                lineHeight: 1.5,
                color: "#2B1B12",
                opacity: 0.7,
              }}>
                We grill every burger to order on our flat-top griddle, so you get a hot, crispy edge and juicy center every time.
              </p>
            </div>
          </div>
          <div style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "1.5rem",
            padding: "1.5rem",
            borderRadius: 8,
            background: "var(--color-cream-text)",
            transition: "transform 250ms ease, box-shadow 250ms ease",
          }}>
            <div style={{
              flexShrink: 0,
              width: 48,
              height: 48,
              borderRadius: "9999px",
              background: "#F2A93B",
              color: "#2B1B12",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-5-5-5 5v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{
                fontFamily: "Work Sans, sans-serif",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#2B1B12",
                marginBottom: "0.25rem",
              }}>
                Fast Delivery
              </p>
              <p style={{
                fontFamily: "Work Sans, sans-serif",
                fontSize: "0.75rem",
                lineHeight: 1.5,
                color: "#2B1B12",
                opacity: 0.7,
              }}>
                We partner with local couriers to deliver your order within 30 minutes. Cold food isn't our thing.
              </p>
            </div>
          </div>
          <div style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "1.5rem",
            padding: "1.5rem",
            borderRadius: 8,
            background: "var(--color-cream-text)",
            transition: "transform 250ms ease, box-shadow 250ms ease",
          }}>
            <div style={{
              flexShrink: 0,
              width: 48,
              height: 48,
              borderRadius: "9999px",
              background: "#2B1B12",
              color: "#FBF3E3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-5-5-5 5v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{
                fontFamily: "Work Sans, sans-serif",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#2B1B12",
                marginBottom: "0.25rem",
              }}>
                Quality Ingredients
              </p>
              <p style={{
                fontFamily: "Work Sans, sans-serif",
                fontSize: "0.75rem",
                lineHeight: 1.5,
                color: "#2B1B12",
                opacity: 0.7,
              }}>
                From locally-ground beef to vine-ripened tomatoes, everything we source is fresh — never frozen, never compromised.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}