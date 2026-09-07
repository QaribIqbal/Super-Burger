import type { MenuItem } from "./menu-data";

export interface CartLine {
  id: string;
  productId: string;
  quantity: number;
  selectedModifiers: SelectedModifier[];
  specialInstructions: string;
  addedAt: number;
}

export interface SelectedModifier {
  groupId: string;
  optionId: string;
}

export interface CartState {
  lines: CartLine[];
  version: number;
}

export const CART_STORAGE_VERSION = 1;
export const CART_STORAGE_KEY = "super-burger-cart";

export type CartAction =
  | { type: "ADD_LINE"; payload: AddLinePayload }
  | { type: "UPDATE_QUANTITY"; payload: { lineId: string; quantity: number } }
  | { type: "REMOVE_LINE"; payload: { lineId: string } }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; payload: CartState }
  | { type: "UPDATE_SPECIAL_INSTRUCTIONS"; payload: { lineId: string; instructions: string } };

export interface AddLinePayload {
  productId: string;
  quantity: number;
  selectedModifiers: SelectedModifier[];
  specialInstructions: string;
}

export function generateLineKey(payload: AddLinePayload): string {
  const modifierKey = payload.selectedModifiers
    .map((m) => `${m.groupId}:${m.optionId}`)
    .sort()
    .join("|");
  const normalizedNotes = payload.specialInstructions.trim().toLowerCase();
  return `${payload.productId}::${modifierKey}::${normalizedNotes}`;
}

function findMatchingLine(lines: CartLine[], payload: AddLinePayload): CartLine | undefined {
  const key = generateLineKey(payload);
  return lines.find((line) => line.id === key);
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_LINE": {
      const { productId, quantity, selectedModifiers, specialInstructions } = action.payload;
      const payload: AddLinePayload = { productId, quantity, selectedModifiers, specialInstructions };
      const existingLine = findMatchingLine(state.lines, payload);

      if (existingLine) {
        const newQuantity = Math.min(existingLine.quantity + quantity, 20);
        return {
          ...state,
          lines: state.lines.map((line) =>
            line.id === existingLine.id ? { ...line, quantity: newQuantity } : line
          ),
        };
      }

      const newLine: CartLine = {
        id: generateLineKey(payload),
        productId,
        quantity: Math.min(quantity, 20),
        selectedModifiers,
        specialInstructions: specialInstructions.trim(),
        addedAt: Date.now(),
      };

      return { ...state, lines: [...state.lines, newLine] };
    }

    case "UPDATE_QUANTITY": {
      const { lineId, quantity } = action.payload;
      const clampedQuantity = Math.max(1, Math.min(quantity, 20));
      return {
        ...state,
        lines: state.lines.map((line) =>
          line.id === lineId ? { ...line, quantity: clampedQuantity } : line
        ),
      };
    }

    case "REMOVE_LINE": {
      const { lineId } = action.payload;
      return {
        ...state,
        lines: state.lines.filter((line) => line.id !== lineId),
      };
    }

    case "CLEAR_CART": {
      return { ...state, lines: [] };
    }

    case "HYDRATE": {
      return { ...action.payload, version: CART_STORAGE_VERSION };
    }

    case "UPDATE_SPECIAL_INSTRUCTIONS": {
      const { lineId, instructions } = action.payload;
      return {
        ...state,
        lines: state.lines.map((line) =>
          line.id === lineId ? { ...line, specialInstructions: instructions.trim() } : line
        ),
      };
    }

    default:
      return state;
  }
}

export const initialCartState: CartState = {
  lines: [],
  version: CART_STORAGE_VERSION,
};

export function getCartItemCount(state: CartState): number {
  return state.lines.reduce((sum, line) => sum + line.quantity, 0);
}

export function getCartLineCount(state: CartState): number {
  return state.lines.length;
}

export function isCartEmpty(state: CartState): boolean {
  return state.lines.length === 0;
}

export function getLineById(state: CartState, lineId: string): CartLine | undefined {
  return state.lines.find((line) => line.id === lineId);
}

export function validateCartAgainstMenu(state: CartState, menuItems: MenuItem[]): CartState {
  const validLines = state.lines.filter((line) => {
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

  if (validLines.length !== state.lines.length) {
    return { ...state, lines: validLines };
  }
  return state;
}

export function getLinesForProduct(state: CartState, productId: string): CartLine[] {
  return state.lines.filter((line) => line.productId === productId);
}

export function getTotalQuantityForProduct(state: CartState, productId: string): number {
  return state.lines
    .filter((line) => line.productId === productId)
    .reduce((sum, line) => sum + line.quantity, 0);
}
