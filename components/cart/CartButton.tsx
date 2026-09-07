"use client";

import { useCart } from "./CartProvider";
import styles from "./CartButton.module.css";

export default function CartButton({ onOpen }: { onOpen: () => void }) {
  const itemCount = useCartItemCount();

  return (
    <button
      className={styles.cartButton}
      onClick={onOpen}
      aria-label={itemCount > 0 ? `Open cart, ${itemCount} items` : "Open cart, empty"}
      type="button"
    >
      <svg className={styles.cartIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1 0 8" />
      </svg>
      {itemCount > 0 && <span className={styles.badge} aria-hidden="true">{itemCount > 99 ? "99+" : itemCount}</span>}
    </button>
  );
}

function useCartItemCount(): number {
  const { itemCount } = useCart();
  return itemCount;
}