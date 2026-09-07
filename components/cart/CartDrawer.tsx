"use client";

import { useEffect, useRef, useCallback } from "react";
import { useCart } from "./CartProvider";
import { formatCents } from "@/lib/pricing";
import { businessConfig } from "@/lib/business-config";
import Link from "next/link";
import CartLineItem from "./CartLineItem";
import styles from "./CartDrawer.module.css";

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const {
    state,
    lineCount,
    isEmpty,
    updateQuantity,
    removeLine,
    clearCart,
    getPricingBreakdown,
  } = useCart();

  const drawerRef = useRef<HTMLDialogElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const pricing = getPricingBreakdown(false);

  useEffect(() => {
    const dialog = drawerRef.current;
    if (!dialog) return;

    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      dialog.showModal();
      document.body.style.overflow = "hidden";
      const firstFocusable = dialog.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      firstFocusable?.focus();
    } else {
      dialog.close();
      document.body.style.overflow = "";
      previousActiveElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  }, [onClose]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleClearCart = () => {
    if (lineCount <= 1 || window.confirm("Clear all items from your cart?")) {
      clearCart();
    }
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={drawerRef}
      className={styles.drawer}
      onKeyDown={handleKeyDown}
      onClick={handleBackdropClick}
      aria-label="Shopping cart"
    >
      <div className={styles.drawerInner}>
        <header className={styles.header}>
          <h2 className={styles.title}>Your Order</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close cart"
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        {isEmpty ? (
          <div className={styles.empty}>
            <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
            </svg>
            <p className={styles.emptyText}>Your cart is empty</p>
            <Link href="/menu" className={styles.emptyLink} onClick={onClose}>
              Browse Menu
            </Link>
          </div>
        ) : (
          <>
            <ul className={styles.itemsList} role="list" aria-label="Cart items">
              {state.lines.map((line) => (
                <CartLineItem
                  key={line.id}
                  line={line}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeLine}
                />
              ))}
            </ul>

            <div className={styles.divider} />

            <div className={styles.actions}>
              <button className={styles.clearButton} onClick={handleClearCart} type="button">
                Clear Cart
              </button>
              <Link href="/checkout" className={styles.checkoutLink} onClick={onClose}>
                Checkout
                <span className={styles.checkoutTotal}>{formatCents(pricing.totalCents, businessConfig)}</span>
              </Link>
            </div>

            <p className={styles.demoNotice}>
              Demo mode — no payment will be collected
            </p>
          </>
        )}
      </div>
    </dialog>
  );
}
