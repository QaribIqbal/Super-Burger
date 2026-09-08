"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { categories, menuItems, type CategoryId, type MenuItem, type MenuTag } from "@/lib/menu-data";
import { formatCents } from "@/lib/pricing";
import { businessConfig } from "@/lib/business-config";
import { useCart } from "@/components/cart/CartProvider";
import ProductCustomizer from "@/components/menu/ProductCustomizer";
import { getMenuOrderAction, getStandardModifiers } from "@/lib/menu-ordering.mjs";
import styles from "./page.module.css";

const filters: { id: MenuTag; label: string }[] = [
  { id: "spicy", label: "Spicy" }, { id: "vegetarian", label: "Vegetarian" },
  { id: "popular", label: "Popular" }, { id: "new", label: "New" },
];

export default function MenuPage() {
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [activeFilters, setActiveFilters] = useState<MenuTag[]>([]);
  const [customizing, setCustomizing] = useState<MenuItem | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addLine, itemCount } = useCart();
  const triggerRef = useRef<HTMLElement>(null);
  const filteredItems = menuItems.filter((item) => item.availability !== "hidden" && (!category || item.category === category) && activeFilters.every((filter) => item.tags?.includes(filter)));

  useEffect(() => {
    const id = window.location.hash.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (target) {
      window.setTimeout(() => { setHighlightedId(id); target.scrollIntoView({ block: "start" }); }, 0);
      window.setTimeout(() => setHighlightedId(null), 2200);
    }
  }, []);

  const clearFilters = () => { setCategory(null); setActiveFilters([]); };
  const toggleFilter = (filter: MenuTag) => setActiveFilters((current) => current.includes(filter) ? current.filter((value) => value !== filter) : [...current, filter]);
  const addStandardItem = (item: MenuItem, button: HTMLButtonElement) => {
    triggerRef.current = button;
    addLine({ productId: item.id, quantity: 1, selectedModifiers: getStandardModifiers(item), specialInstructions: "" });
    setAddedId(item.id);
    window.setTimeout(() => setAddedId((current) => current === item.id ? null : current), 1400);
  };

  return <main id="main-content" className={styles.page}>
    <div className={styles.inner}>
      <header className={styles.intro}><p className={styles.eyebrow}>Order online · demo checkout</p><h1 className={styles.title}>The menu</h1><p>Fresh-grilled burgers, crisp sides, and cold drinks. Customize your order, then choose pickup or delivery at checkout.</p></header>
      <section className={styles.toolbar} aria-label="Menu filters">
        <div className={styles.filterSection}><span className={styles.filterLabel}>Browse</span><div className={styles.scroller} role="group" aria-label="Categories">
          <button type="button" className={styles.tab} aria-pressed={category === null} onClick={() => setCategory(null)}>All Items</button>
          {categories.map((item) => <button type="button" key={item.id} className={styles.tab} aria-pressed={category === item.id} onClick={() => setCategory(item.id)}>{item.label}</button>)}
        </div></div>
        <div className={styles.filterRow}><span className={styles.filterLabel}>Filter</span>{filters.map((filter) => <button type="button" key={filter.id} className={styles.filter} aria-pressed={activeFilters.includes(filter.id)} onClick={() => toggleFilter(filter.id)}>{filter.label}</button>)}{(category || activeFilters.length > 0) && <button type="button" className={styles.clear} onClick={clearFilters}>Clear filters</button>}<span className={styles.count} role="status" aria-live="polite">{filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}</span></div>
      </section>
      {filteredItems.length === 0 ? <div className={styles.empty}><h2>Nothing matches yet</h2><p>Try another category or clear your filters.</p><button type="button" onClick={clearFilters}>Show all items</button></div> : <div className={styles.grid}>
        {filteredItems.map((item) => <article key={item.id} id={item.id} className={`${styles.card} ${highlightedId === item.id ? styles.highlighted : ""}`}>
          <div className={styles.image}><Image src={item.image} alt="" fill sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw" /></div>
          <div className={styles.body}><div className={styles.badges}>{item.tags?.slice(0, 2).map((tag) => <span key={tag} className={styles.badge}>{tag}</span>)}</div><h2 className={styles.name}>{item.name}</h2><p className={styles.description}>{item.description}</p><details className={styles.allergens}><summary>Allergen information</summary><span>{item.allergens?.length ? `Contains: ${item.allergens.join(", ")}` : "No listed allergens"}</span></details>{item.availability === "limited" && <p className={styles.meta}>Limited availability</p>}<div className={styles.cardFooter}><div><span className={styles.price}>{formatCents(item.basePriceCents, businessConfig)}</span><span className={styles.priceNote}> each</span></div><div className={styles.actions}>{getMenuOrderAction(item) === "add" && <button type="button" className={styles.add} onClick={(event) => addStandardItem(item, event.currentTarget)}>{addedId === item.id ? "Added" : "Add to cart"}</button>}{getMenuOrderAction(item) === "choose-options" && <button type="button" className={styles.add} onClick={(event) => { triggerRef.current = event.currentTarget; setCustomizing(item); }}>Choose options</button>}{getMenuOrderAction(item) === "unavailable" && <button type="button" className={styles.add} disabled>Unavailable</button>}{item.modifierGroups?.length && getMenuOrderAction(item) !== "unavailable" && <button type="button" className={styles.customize} onClick={(event) => { triggerRef.current = event.currentTarget; setCustomizing(item); }}>Customize</button>}</div></div></div>
        </article>)}
      </div>}
    </div>
    {itemCount > 0 && <a className={styles.mobileCart} href="/checkout">View cart · {itemCount}</a>}
    {customizing && <ProductCustomizer item={customizing} open onClose={() => setCustomizing(null)} triggerRef={triggerRef} />}
  </main>;
}
