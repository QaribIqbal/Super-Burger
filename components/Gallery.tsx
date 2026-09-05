import Image from "next/image";
import styles from "./Gallery.module.css";

export default function Gallery() {
  return (
    <section id="gallery" className={styles.gallery} aria-labelledby="gallery-title">
      <div className={styles.gallery__inner}>
        <header className={styles.gallery__header}>
          <h2 id="gallery-title" className={styles.gallery__title}>Gallery</h2>
          <a href="#" className={styles.gallery__viewAll}>
            View All Photos →
          </a>
        </header>
        <div className={styles.gallery__grid}>
          <article className={styles.gallery__item}>
            <Image
              src="/images/burger-assembled.jpg"
              alt="Classic cheeseburger with lettuce, tomato, and pickles on sesame bun"
              fill
              priority={false}
              sizes="(max-width: 1024px) 400px, 600px"
              className={styles.gallery__img}
            />
          </article>
          <article className={styles.gallery__item}>
            <Image
              src="/images/burger-spicy-crispy.jpg"
              alt="Spicy crispy chicken burger with slaw and chipotle mayo"
              fill
              priority={false}
              sizes="(max-width: 1024px) 400px, 600px"
              className={styles.gallery__img}
            />
          </article>
          <article className={styles.gallery__item}>
            <Image
              src="/images/fries-closeup.jpg"
              alt="Golden crinkle-cut fries with sea salt in a metal basket"
              fill
              priority={false}
              sizes="(max-width: 1024px) 400px, 600px"
              className={styles.gallery__img}
            />
          </article>
          <article className={styles.gallery__item}>
            <Image
              src="/images/malt-shake.jpg"
              alt="Thick chocolate malt shake with whipped cream and cherry"
              fill
              priority={false}
              sizes="(max-width: 1024px) 400px, 600px"
              className={styles.gallery__img}
            />
          </article>
        </div>

        <div className={styles.gallery__socialProof} role="list" aria-label="Customer quotes">
          <h3 className={styles.gallery__title} style={{ margin: "0 0 var(--space-md)", fontSize: "var(--text-lg)" }}>
            What Customers Say
          </h3>
          <blockquote className={styles.gallery__quote}>
            <p>"The best smash burgers in the city. Crispy edges, perfect melt, every time."</p>
            <cite>— Alex R.</cite>
          </blockquote>
          <blockquote className={styles.gallery__quote}>
            <p>"Delivery in 28 minutes. Still hot. Actually hot."</p>
            <cite>— Maya T.</cite>
          </blockquote>
          <blockquote className={styles.gallery__quote}>
            <p>"Finally a burger place that doesn't skimp on the patty."</p>
            <cite>— Chris P.</cite>
          </blockquote>
        </div>
      </div>
    </section>
  );
}