"use client";

import { createContext, useContext, useReducer, useEffect, useCallback, useMemo, useRef, type ReactNode } from "react";
import type { CartState, AddLinePayload, CartLine } from "@/lib/cart";
import { cartReducer, initialCartState, getCartItemCount, validateCartAgainstMenu } from "@/lib/cart";
import { loadCart, saveCart, subscribeToStorageChanges } from "@/lib/cart-storage";
import { menuItems } from "@/lib/menu-data";
import { calculatePricingBreakdown } from "@/lib/pricing";

interface CartContextValue {
  state: CartState;
  itemCount: number;
  lineCount: number;
  isEmpty: boolean;
  addLine: (payload: AddLinePayload) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  clearCart: () => void;
  updateSpecialInstructions: (lineId: string, instructions: string) => void;
  getLine: (lineId: string) => CartLine | undefined;
  getQuantityForProduct: (productId: string) => number;
  getPricingBreakdown: (isDelivery: boolean) => {
    subtotalCents: number;
    taxCents: number;
    deliveryFeeCents: number;
    totalCents: number;
  };
  getLinesForProduct: (productId: string) => CartLine[];
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  const hasHydrated = useRef(false);

  useEffect(() => {
    dispatch({ type: "HYDRATE", payload: loadCart(menuItems) });
    const unsubscribe = subscribeToStorageChanges((stored) => {
      if (stored) {
        dispatch({ type: "HYDRATE", payload: validateCartAgainstMenu(stored, menuItems) });
      } else {
        dispatch({ type: "HYDRATE", payload: { lines: [], version: 1 } });
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!hasHydrated.current) { hasHydrated.current = true; return; }
    saveCart(state);
  }, [state]);

  const addLine = useCallback((payload: AddLinePayload) => {
    dispatch({ type: "ADD_LINE", payload });
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { lineId, quantity } });
  }, []);

  const removeLine = useCallback((lineId: string) => {
    dispatch({ type: "REMOVE_LINE", payload: { lineId } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const updateSpecialInstructions = useCallback((lineId: string, instructions: string) => {
    dispatch({ type: "UPDATE_SPECIAL_INSTRUCTIONS", payload: { lineId, instructions } });
  }, []);

  const getLine = useCallback((lineId: string) => state.lines.find((l) => l.id === lineId), [state.lines]);

  const getQuantityForProduct = useCallback(
    (productId: string) => state.lines.filter((l) => l.productId === productId).reduce((sum, l) => sum + l.quantity, 0),
    [state.lines]
  );

  const getLinesForProduct = useCallback(
    (productId: string) => state.lines.filter((l) => l.productId === productId),
    [state.lines]
  );

  const getPricingBreakdown = useCallback(
    (isDelivery: boolean) => calculatePricingBreakdown(state, menuItems, isDelivery),
    [state]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      state,
      itemCount: getCartItemCount(state),
      lineCount: state.lines.length,
      isEmpty: state.lines.length === 0,
      addLine,
      updateQuantity,
      removeLine,
      clearCart,
      updateSpecialInstructions,
      getLine,
      getQuantityForProduct,
      getLinesForProduct,
      getPricingBreakdown,
    }),
    [
      state,
      addLine,
      updateQuantity,
      removeLine,
      clearCart,
      updateSpecialInstructions,
      getLine,
      getQuantityForProduct,
      getLinesForProduct,
      getPricingBreakdown,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export function useCartItemCount(): number {
  return useCart().itemCount;
}

export function useCartLines(): CartLine[] {
  return useCart().state.lines;
}

export function useCartPricing(isDelivery: boolean) {
  return useCart().getPricingBreakdown(isDelivery);
}
