import Link from "next/link";
import { businessConfig, isOrderingEnabled } from "@/lib/business-config";
import styles from "./FinalCTA.module.css";

export default function FinalCTA() {
  const orderHref = isOrderingEnabled() ? "/checkout" : "/menu";

  return (
    <section id="order" className={styles.section} aria-labelledby="final-cta-headline">
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.content}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{businessConfig.brand.name}</p>
          <h2 id="final-cta-headline" className={styles.title}>Order Now</h2>
          <p className={styles.description}>Delivery or pickup. Fresh from the grill to your door.</p>
        </header>
        <Link href={orderHref} className={styles.button}>Place My Order</Link>
      </div>
    </section>
  );
}
