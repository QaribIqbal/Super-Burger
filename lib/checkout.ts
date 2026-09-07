import type { CartState } from "./cart";
import type { MenuItem } from "./menu-data";

export type FulfillmentMethod = "pickup" | "delivery";

export interface CheckoutFormData {
  fulfillmentMethod: FulfillmentMethod;
  name: string;
  phone: string;
  email: string;
  notes: string;
  address?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  deliveryInstructions?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export function validateCheckoutForm(
  data: CheckoutFormData,
  cartState: CartState
): ValidationResult {
  const errors: ValidationError[] = [];

  if (isCartEmpty(cartState)) {
    errors.push({ field: "cart", message: "Your cart is empty" });
  }

  if (!data.fulfillmentMethod || !["pickup", "delivery"].includes(data.fulfillmentMethod)) {
    errors.push({ field: "fulfillmentMethod", message: "Please select pickup or delivery" });
  }

  if (!data.name.trim()) {
    errors.push({ field: "name", message: "Name is required" });
  }

  if (!data.phone.trim()) {
    errors.push({ field: "phone", message: "Phone number is required" });
  } else if (!/^[\d\s\-+()]{10,}$/.test(data.phone)) {
    errors.push({ field: "phone", message: "Please enter a valid phone number" });
  }

  if (!data.email.trim()) {
    errors.push({ field: "email", message: "Email is required" });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push({ field: "email", message: "Please enter a valid email address" });
  }

  if (data.fulfillmentMethod === "delivery") {
    if (!data.address?.trim()) {
      errors.push({ field: "address", message: "Delivery address is required" });
    }
    if (!data.city?.trim()) {
      errors.push({ field: "city", message: "City is required" });
    }
    if (!data.region?.trim()) {
      errors.push({ field: "region", message: "State/Region is required" });
    }
    if (!data.postalCode?.trim()) {
      errors.push({ field: "postalCode", message: "Postal code is required" });
    } else if (!/^\d{5}(-\d{4})?$/.test(data.postalCode)) {
      errors.push({ field: "postalCode", message: "Please enter a valid postal code" });
    }
  }

  return { valid: errors.length === 0, errors };
}

export function getFieldError(errors: ValidationError[], field: string): string | undefined {
  return errors.find((e) => e.field === field)?.message;
}

export function hasFieldError(errors: ValidationError[], field: string): boolean {
  return errors.some((e) => e.field === field);
}

export function createEmptyCheckoutForm(): CheckoutFormData {
  return {
    fulfillmentMethod: "pickup",
    name: "",
    phone: "",
    email: "",
    notes: "",
    address: "",
    city: "",
    region: "",
    postalCode: "",
    deliveryInstructions: "",
  };
}

export function isCartEmpty(state: CartState): boolean {
  return state.lines.length === 0;
}

export function getCheckoutSummaryLines(state: CartState, menuItems: MenuItem[]): CheckoutSummaryLine[] {
  return state.lines.map((line) => {
    const item = menuItems.find((m) => m.id === line.productId);
    if (!item) {
      return {
        id: line.id,
        name: "Unknown Item",
        quantity: line.quantity,
        modifiers: [],
        specialInstructions: line.specialInstructions,
        lineTotalCents: 0,
      };
    }
    const modifierNames = line.selectedModifiers
      .map((sel) => {
        const group = item.modifierGroups?.find((g) => g.id === sel.groupId);
        const option = group?.options.find((o) => o.id === sel.optionId);
        return option?.name;
      })
      .filter(Boolean) as string[];

    return {
      id: line.id,
      name: item.name,
      quantity: line.quantity,
      modifiers: modifierNames,
      specialInstructions: line.specialInstructions,
      lineTotalCents: line.quantity * (item.basePriceCents + line.selectedModifiers.reduce((sum, sel) => {
        const group = item.modifierGroups?.find((g) => g.id === sel.groupId);
        const option = group?.options.find((o) => o.id === sel.optionId);
        return sum + (option?.priceDeltaCents ?? 0);
      }, 0)),
    };
  });
}

export interface CheckoutSummaryLine {
  id: string;
  name: string;
  quantity: number;
  modifiers: string[];
  specialInstructions: string;
  lineTotalCents: number;
}
