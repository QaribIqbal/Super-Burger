import Image from "next/image";
import cityMap from "@/public/images/location/city-map.jpg";
import { ORDER_URL } from "@/lib/config";
import styles from "./Location.module.css";

export default function Location() {
  return (
    <section id="locations" className={styles.location} aria-labelledby="locations-title">
      <div className={styles.inner}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Come hungry</p>
            <h2 id="locations-title">Find us in Flavor Town</h2>
          </div>
          <a href={ORDER_URL} className={styles.orderLink}>Order for delivery →</a>
        </header>

        <div className={styles.layout}>
          <div className={styles.details}>
            <div className={styles.detailRow}>
              <LocationPinIcon />
              <div>
                <strong>Super Burger Co.</strong>
                <span>123 Burger Lane, Flavor Town, FT 12345</span>
              </div>
            </div>
            <div className={styles.detailRow}>
              <ClockIcon />
              <div>
                <strong>Opening hours</strong>
                <span>Mon–Thu: 11am–10pm</span>
                <span>Fri–Sun: 11am–11pm</span>
              </div>
            </div>
            <div className={styles.detailRow}>
              <PhoneIcon />
              <div>
                <strong>Call ahead</strong>
                <a href="tel:+1234567890">+1 (234) 567-890</a>
              </div>
            </div>
          </div>

          <figure className={styles.mapCard}>
            <Image
              src={cityMap}
              alt="Printed city street map marked with location pins"
              fill
              placeholder="blur"
              sizes="(max-width: 800px) 100vw, 58vw"
              className={styles.mapImage}
            />
            <figcaption className={styles.mapLabel}>
              <span className={styles.mapDot} aria-hidden="true" />
              <span><strong>You found us</strong>123 Burger Lane</span>
            </figcaption>
            <small className={styles.credit}>Photo by GeoJango Maps on Unsplash</small>
          </figure>
        </div>
      </div>
    </section>
  );
}

function LocationPinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.4 1.8.6 2.8.7a2 2 0 0 1 1.7 2.1Z" />
    </svg>
  );
}
