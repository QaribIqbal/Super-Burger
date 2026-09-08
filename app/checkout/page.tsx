"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { businessConfig } from "@/lib/business-config";
import { formatCents } from "@/lib/pricing";
import { createEmptyCheckoutForm, getCheckoutSummaryLines, getFieldError, validateCheckoutForm, type CheckoutFormData } from "@/lib/checkout";
import { demoOrderAdapter, type OrderConfirmation } from "@/lib/demo-order-adapter";
import { useCart } from "@/components/cart/CartProvider";
import { menuItems } from "@/lib/menu-data";
import styles from "./page.module.css";

const confirmationKey = "super-burger-demo-confirmation";

export default function CheckoutPage() {
  const { state, isEmpty, clearCart, getPricingBreakdown } = useCart();
  const [form, setForm] = useState<CheckoutFormData>(createEmptyCheckoutForm);
  const [errors, setErrors] = useState<{ field: string; message: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(null);
  const shouldFocusSummary = useRef(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const pricing = getPricingBreakdown(form.fulfillmentMethod === "delivery");
  const summaryLines = getCheckoutSummaryLines(state, menuItems);

  useEffect(() => { try { const raw = sessionStorage.getItem(confirmationKey); if (raw) setConfirmation(JSON.parse(raw)); } catch { /* safe missing-state fallback */ } }, []);
  useEffect(() => { if (shouldFocusSummary.current && errors.length) { shouldFocusSummary.current = false; errorSummaryRef.current?.focus(); } }, [errors]);

  if (confirmation) return <main id="main-content" className={styles.page}><div className={styles.confirmation}><p className={styles.demo}>Demo order confirmation</p><h1>Order received</h1><div className={styles.confirmationBox}><p><strong>{confirmation.orderId}</strong></p><p>{confirmation.demoMessage}</p><p>Total: <strong>{formatCents(confirmation.totalCents, businessConfig)}</strong></p><p>Estimated {confirmation.fulfillmentMethod === "pickup" ? "ready" : "delivery"}: {new Date(confirmation.estimatedReadyTime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</p></div><Link className={styles.link} href="/menu">Order something else</Link></div></main>;
  if (isEmpty) return <main id="main-content" className={styles.page}><div className={styles.empty}><h1>Your cart is empty</h1><p>Add something delicious before checking out.</p><Link className={styles.link} href="/menu">Browse the menu</Link></div></main>;

  const update = (field: keyof CheckoutFormData, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const validate = () => { const result = validateCheckoutForm(form, state); setErrors(result.errors); return result.valid; };
  const submit = async (event: React.FormEvent) => { event.preventDefault(); shouldFocusSummary.current = true; if (!validate()) return; setSubmitting(true); try { const result = await demoOrderAdapter.submitOrder(form, pricing); const saved = { ...result, items: summaryLines }; sessionStorage.setItem(confirmationKey, JSON.stringify(saved)); setConfirmation(saved); clearCart(); } catch (error) { setErrors([{ field: "form", message: error instanceof Error ? error.message : "We could not submit the demo order." }]); } finally { setSubmitting(false); } };
  const errorFor = (field: string) => getFieldError(errors, field);
  const input = (field: keyof CheckoutFormData, label: string, type = "text", full = false) => <div className={`${styles.field} ${full ? styles.full : ""}`}><label htmlFor={`checkout-${field}`}>{label}</label><input id={`checkout-${field}`} type={type} value={String(form[field] ?? "")} onChange={(event) => update(field, event.target.value)} onBlur={validate} aria-invalid={Boolean(errorFor(field))} aria-describedby={errorFor(field) ? `error-${field}` : undefined} />{errorFor(field) && <span id={`error-${field}`} className={styles.fieldError}>{errorFor(field)}</span>}</div>;

  return <main id="main-content" className={styles.page}><div className={styles.inner}><header className={styles.intro}><p className={styles.demo}>Demo checkout · no payment collected</p><h1 className={styles.title}>Finish your order</h1><p>Choose pickup or delivery, then tell us where to send your order.</p></header><div className={styles.layout}><form className={styles.panel} onSubmit={submit} noValidate>{errors.length > 0 && <div ref={errorSummaryRef} className={styles.errorSummary} tabIndex={-1} role="alert"><strong>Check the highlighted fields.</strong><ul>{errors.map((error) => <li key={`${error.field}-${error.message}`}>{error.message}</li>)}</ul></div>}<h2>Fulfillment</h2><div className={styles.methods}>{(["pickup", "delivery"] as const).map((method) => <label key={method} className={styles.method}><input type="radio" name="fulfillment" checked={form.fulfillmentMethod === method} onChange={() => update("fulfillmentMethod", method)} />{method === "pickup" ? "Pickup" : "Delivery"}</label>)}</div><h2>Your details</h2><div className={styles.fields}>{input("name", "Name", "text", true)}{input("phone", "Phone", "tel")}{input("email", "Email", "email")}{form.fulfillmentMethod === "delivery" && <>{input("address", "Address", "text", true)}{input("city", "City")}{input("region", "State / region")}{input("postalCode", "Postal code")}{input("deliveryInstructions", "Delivery instructions", "text", true)}</>} {input("notes", "Order notes", "text", true)}</div><button className={styles.submit} type="submit" disabled={submitting}>{submitting ? "Preparing demo order…" : "Place demo order"}</button></form><aside className={`${styles.panel} ${styles.summary}`}><details open><summary>Order summary</summary>{summaryLines.map((line) => <div className={styles.summaryLine} key={line.id}><span>{line.quantity} × {line.name}<small>{line.modifiers.join(", ")}</small></span><strong>{formatCents(line.lineTotalCents, businessConfig)}</strong></div>)}</details><div className={styles.totals}><div className={styles.total}><span>Subtotal</span><span>{formatCents(pricing.subtotalCents, businessConfig)}</span></div><div className={styles.total}><span>Tax</span><span>{formatCents(pricing.taxCents, businessConfig)}</span></div><div className={styles.total}><span>{form.fulfillmentMethod === "delivery" ? "Delivery" : "Pickup"}</span><span>{pricing.deliveryFeeCents ? formatCents(pricing.deliveryFeeCents, businessConfig) : "Free"}</span></div><div className={`${styles.total} ${styles.grand}`}><span>Total</span><span>{formatCents(pricing.totalCents, businessConfig)}</span></div></div></aside></div></div></main>;
}
