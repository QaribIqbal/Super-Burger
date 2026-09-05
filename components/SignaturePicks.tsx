import Link from "next/link";
import Image from "next/image";
import styles from "./SignaturePicks.module.css";
import { getSignaturePicks } from "@/lib/menu-data";

export default function SignaturePicks() {
  const items = getSignaturePicks();

  return (
    <section className={styles.signature} aria-labelledby="signature-title">
      <div className={styles.signature__inner}>
        <header className={styles.signature__header}>
          <h2 id="signature-title" className={styles.signature__title}>
            Signature Picks
          </h2>
          <Link href="/menu" className={styles.signature__viewAll}>
            View All →
          </Link>
        </header>
        <div className={styles.signature__scroll} role="list">
          {items.map((item) => (
            <article key={item.id} className={styles.signature__card} role="listitem">
              <div className={styles.signature__image}>
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 280px, 320px"
                  className={styles.signature__img}
                />
                {item.tags && item.tags.map((tag) => (
                  <span key={tag} className={`${styles.signature__tag} ${styles[`signature__tag--${tag}`]}`}>
                    {tag === "popular" ? "Popular" : tag === "spicy" ? "Spicy" : "Vegetarian"}
                  </span>
                ))}
              </div>
              <div className={styles.signature__content}>
                <h3 className={styles.signature__name}>{item.name}</h3>
                <p className={styles.signature__description}>{item.description}</p>
                <div className={styles.signature__footer}>
                  <span className={styles.signature__price}>${item.price.toFixed(2)}</span>
                  <Link href={`/menu#${item.id}`} className={styles.signature__link}>
                    View Details
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}