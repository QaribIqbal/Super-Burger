"use client";

import Image from "next/image";
import { menuItems } from "@/lib/menu-data";
import { formatCents } from "@/lib/pricing";
import { businessConfig } from "@/lib/business-config";
import styles from "./CartLineItem.module.css";

interface CartLineItemProps {
  line: {
    id: string;
    productId: string;
    quantity: number;
    selectedModifiers: { groupId: string; optionId: string }[];
    specialInstructions: string;
  };
  onUpdateQuantity: (lineId: string, quantity: number) => void;
  onRemove: (lineId: string) => void;
}

export default function CartLineItem({ line, onUpdateQuantity, onRemove }: CartLineItemProps) {
  const item = menuItems.find((m) => m.id === line.productId);
  const modifierNames = line.selectedModifiers
    .map((sel) => {
      const group = item?.modifierGroups?.find((g) => g.id === sel.groupId);
      const option = group?.options.find((o) => o.id === sel.optionId);
      return option?.name;
    })
    .filter(Boolean) as string[];

  const basePrice = item?.basePriceCents ?? 0;
  const modifierDelta = line.selectedModifiers.reduce((sum, sel) => {
    const group = item?.modifierGroups?.find((g) => g.id === sel.groupId);
    const option = group?.options.find((o) => o.id === sel.optionId);
    return sum + (option?.priceDeltaCents ?? 0);
  }, 0);
  const unitPrice = basePrice + modifierDelta;
  const lineTotal = unitPrice * line.quantity;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, Math.min(20, line.quantity + delta));
    onUpdateQuantity(line.id, newQuantity);
  };

  const handleRemove = () => {
    onRemove(line.id);
  };

  return (
    <li className={styles.lineItem}>
      <div className={styles.imageWrapper}>
        {item?.image ? (
          <Image
            src={item.image}
            alt=""
            fill
            sizes="80px"
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholder} aria-hidden="true" />
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.name}>{item?.name ?? "Unknown Item"}</h3>
          <button
            className={styles.removeButton}
            onClick={handleRemove}
            aria-label={`Remove ${item?.name ?? "item"} from cart`}
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {modifierNames.length > 0 && (
          <ul className={styles.modifiers} aria-label="Selected options">
            {modifierNames.map((name, i) => (
              <li key={i} className={styles.modifier}>
                <span className={styles.modifierDot} aria-hidden="true" />
                {name}
              </li>
            ))}
          </ul>
        )}

        {line.specialInstructions && (
          <p className={styles.instructions}>
            <span className={styles.instructionsLabel}>Note: </span>
            {line.specialInstructions}
          </p>
        )}

        <div className={styles.footer}>
          <div className={styles.quantity} role="group" aria-label={`${item?.name} quantity`}>
            <button
              className={styles.quantityButton}
              onClick={() => handleQuantityChange(-1)}
              aria-label="Decrease quantity"
              disabled={line.quantity <= 1}
              type="button"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <span className={styles.quantityValue} aria-live="polite">{line.quantity}</span>
            <button
              className={styles.quantityButton}
              onClick={() => handleQuantityChange(1)}
              aria-label="Increase quantity"
              disabled={line.quantity >= 20}
              type="button"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
          <span className={styles.lineTotal}>{formatCents(lineTotal, businessConfig)}</span>
        </div>
      </div>
    </li>
  );
}