import { ORDER_URL } from "@/lib/config";

export default function Location() {
  return (
    <section id="locations" style={{
      padding: "4rem 1rem",
      background: "var(--color-rust)",
      color: "var(--color-cream-text)",
    }} aria-labelledby="locations-title">
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 1rem" }}>
        <header style={{
          marginBottom: "3rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}>
          <h2 id="locations-title" style={{
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: "2rem",
            fontWeight: 400,
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
            color: "var(--color-cream-text)",
          }}>
            Location
          </h2>
          <a href={ORDER_URL} style={{
            fontFamily: "Work Sans, sans-serif",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "var(--color-accent-gold)",
            textDecoration: "none",
          }}>
            Order for delivery
          </a>
        </header>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
        }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>123 Burger Lane, Flavor Town, FT 12345</span>
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span>Mon–Thu: 11am–10pm</span>
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <a href="tel:+1234567890" style={{ fontFamily: "Work Sans, sans-serif", fontSize: "0.875rem" }}>
                +1 (234) 567-890
              </a>
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Fri–Sun: 11am–11pm</span>
            </div>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <iframe
              style={{
                width: "100%",
                borderRadius: 8,
                height: 400,
                border: "none",
              }}
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2588.8205146111453!2d-122.41941558450438!3d37.77492981583547!2m3!1f0!2f0!3f0!3m2!1s0x80859a1d7fd0db83%3A0xa5a783495270d831!4e0!5e0!3m2!1sen!2sus!4v1609457347985!5m2!1sen!2sus"
              
              
              title="Super Burger Co. Location"
            />
          </div>
        </div>
      </div>
    </section>
  );
}