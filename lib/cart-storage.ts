import type { CartState } from "./cart";
import type { MenuItem } from "./menu-data";

export interface StorageError extends Error {
  code?: string;
}

export function parseStoredCart(raw: string): CartState | null {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    if (parsed.version !== 1) return null;
    if (!Array.isArray(parsed.lines)) return null;
    return parsed as CartState;
  } catch {
    return null;
  }
}

export function validateAndHydrateCart(stored: CartState | null, menuItems: MenuItem[]): CartState {
  if (!stored) {
    return { lines: [], version: 1 };
  }

  const validLines = stored.lines.filter((line) => {
    const item = menuItems.find((m) => m.id === line.productId);
    if (!item) return false;
    if (item.availability === "unavailable" || item.availability === "hidden") return false;

    for (const selected of line.selectedModifiers) {
      const group = item.modifierGroups?.find((g) => g.id === selected.groupId);
      if (!group) return false;
      const option = group.options.find((o) => o.id === selected.optionId);
      if (!option) return false;
    }

    return true;
  });

  return { lines: validLines, version: 1 };
}

export function loadCart(menuItems: MenuItem[]): CartState {
  if (typeof window === "undefined") {
    return { lines: [], version: 1 };
  }

  try {
    const raw = localStorage.getItem("super-burger-cart");
    if (!raw) return { lines: [], version: 1 };
    const parsed = parseStoredCart(raw);
    return validateAndHydrateCart(parsed, menuItems);
  } catch (error) {
    const err = error as StorageError;
    if (err.name === "QuotaExceededError" || err.code === "22") {
      console.warn("[Cart] Storage quota exceeded, using in-memory cart");
    } else {
      console.warn("[Cart] Failed to load cart from storage:", error);
    }
    return { lines: [], version: 1 };
  }
}

export function saveCart(state: CartState): boolean {
  if (typeof window === "undefined") return false;

  try {
    const toStore = { ...state, version: 1 };
    localStorage.setItem("super-burger-cart", JSON.stringify(toStore));
    return true;
  } catch (error) {
    const err = error as StorageError;
    if (err.name === "QuotaExceededError" || err.code === "22") {
      console.warn("[Cart] Storage quota exceeded, cart not persisted");
    } else {
      console.warn("[Cart] Failed to save cart to storage:", error);
    }
    return false;
  }
}

export function clearCartStorage(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("super-burger-cart");
  } catch {
    // Ignore storage errors on clear
  }
}

export function subscribeToStorageChanges(callback: (state: CartState | null) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleStorage = (event: StorageEvent) => {
    if (event.key === "super-burger-cart") {
      if (event.newValue === null) {
        callback(null);
      } else {
        const parsed = parseStoredCart(event.newValue);
        callback(parsed);
      }
    }
  };

  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}
