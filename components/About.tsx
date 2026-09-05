import Image from "next/image";
import styles from "./About.module.css";

export default function About() {
  return (
    <section id="about" className={styles.about} aria-labelledby="about-title">
      <div className={styles.about__inner}>
        <div className={styles.about__visual}>
          <Image
            src="/images/ezgif-48495279d47d4928-png-split/ezgif-frame-060.png"
            alt="Founder at the grill, flipping burgers"
            fill
            priority={false}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={styles.about__img}
          />
        </div>
        <div className={styles.about__content}>
          <p className={styles.about__eyebrow}>Our Story</p>
          <h2 id="about-title" className={styles.about__title}>
            Started over a backyard grill in 2018
          </h2>
          <p className={styles.about__text}>
            Jake Martinez flipped his first smash burger on a cast-iron griddle behind his parents' house.
            The technique was simple: high heat, thin patty, hard press, salt, flip once. Neighbors lined up.
          </p>
          <p className={styles.about__text}>
            Six years later, we still grind our beef fresh daily, hand-form every patty, and cook on the same
            seasoned steel. No freezers, no shortcuts — just the best damn burger in the city.
          </p>
        </div>
      </div>
    </section>
  );
}