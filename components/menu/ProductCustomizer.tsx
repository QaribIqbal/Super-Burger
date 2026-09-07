"use client";

import { useEffect, useMemo, useState } from "react";
import type { MenuItem, SelectedModifier } from "@/lib/menu-data";
import { formatCents, getDefaultModifiers, validateModifierSelection } from "@/lib/pricing";
import { useCart } from "@/components/cart/CartProvider";
import { businessConfig } from "@/lib/business-config";
import styles from "./ProductCustomizer.module.css";

interface ProductCustomizerProps {
  item: MenuItem;
  open: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export default function ProductCustomizer({ item, open, onClose, triggerRef }: ProductCustomizerProps) {
  const { addLine } = useCart();
  const [selected, setSelected] = useState<SelectedModifier[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      window.setTimeout(() => { setSelected(getDefaultModifiers(item)); setQuantity(1); setNotes(""); }, 0);
    } else {
      triggerRef?.current?.focus();
    }
  }, [open, item, triggerRef]);

  const validation = useMemo(() => validateModifierSelection(item, selected), [item, selected]);
  const price = item.basePriceCents + selected.reduce((sum, selection) => {
    const group = item.modifierGroups?.find((candidate) => candidate.id === selection.groupId);
    return sum + (group?.options.find((option) => option.id === selection.optionId)?.priceDeltaCents ?? 0);
  }, 0);

  if (!open) return null;

  const toggleOption = (groupId: string, optionId: string) => {
    const group = item.modifierGroups?.find((candidate) => candidate.id === groupId);
    if (!group) return;
    setSelected((current) => {
      const existing = current.some((selection) => selection.groupId === groupId && selection.optionId === optionId);
      if (group.maxSelections === 1) {
        return [...current.filter((selection) => selection.groupId !== groupId), { groupId, optionId }];
      }
      if (existing) return current.filter((selection) => !(selection.groupId === groupId && selection.optionId === optionId));
      const count = current.filter((selection) => selection.groupId === groupId).length;
      if (count >= group.maxSelections) return current;
      return [...current, { groupId, optionId }];
    });
  };

  const submit = () => {
    if (!validation.valid) return;
    addLine({ productId: item.id, quantity, selectedModifiers: selected, specialInstructions: notes });
    onClose();
  };

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby={`${item.id}-customize-title`}>
        <header className={styles.header}>
          <div><p className={styles.eyebrow}>Customize your order</p><h2 id={`${item.id}-customize-title`}>{item.name}</h2></div>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close customization">×</button>
        </header>
        <p className={styles.description}>{item.description}</p>
        <div className={styles.groups}>
          {item.modifierGroups?.map((group) => {
            const inputType = group.maxSelections === 1 ? "radio" : "checkbox";
            return <fieldset key={group.id} className={styles.group}>
              <legend>{group.name} <span>{group.required ? "Required" : "Optional"}</span></legend>
              {group.description && <p>{group.description}</p>}
              <div className={styles.options}>
                {group.options.map((option) => {
                  const checked = selected.some((selection) => selection.groupId === group.id && selection.optionId === option.id);
                  return <label key={option.id} className={styles.option}>
                    <input type={inputType} name={group.id} checked={checked} onChange={() => toggleOption(group.id, option.id)} />
                    <span>{option.name}</span>
                    {option.priceDeltaCents > 0 && <small>+{formatCents(option.priceDeltaCents, businessConfig)}</small>}
                  </label>;
                })}
              </div>
            </fieldset>;
          })}
        </div>
        <label className={styles.notes}>Special instructions <textarea value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={240} placeholder="Anything we should know?" /></label>
        <div className={styles.footer}>
          <div className={styles.quantity}><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity">−</button><span>{quantity}</span><button type="button" onClick={() => setQuantity(Math.min(20, quantity + 1))} aria-label="Increase quantity">+</button></div>
          <button type="button" className={styles.add} onClick={submit} disabled={!validation.valid}>Add {quantity} · {formatCents(price * quantity, businessConfig)}</button>
        </div>
        {!validation.valid && <p className={styles.error} role="status">{validation.errors[0]}</p>}
      </section>
    </div>
  );
}
