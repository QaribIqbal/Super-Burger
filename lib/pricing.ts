import type { MenuItem, ModifierGroup, ModifierOption, SelectedModifier } from "./menu-data";
import type { CartLine, CartState } from "./cart";
import { businessConfig } from "./business-config";

export function getModifierOption(group: ModifierGroup, optionId: string): ModifierOption | undefined {
  return group.options.find((opt) => opt.id === optionId);
}

export function calculateModifierDeltaCents(
  item: MenuItem,
  selectedModifiers: SelectedModifier[]
): number {
  let delta = 0;
  for (const selected of selectedModifiers) {
    const group = item.modifierGroups?.find((g) => g.id === selected.groupId);
    if (!group) continue;
    const option = getModifierOption(group, selected.optionId);
    if (option) {
      delta += option.priceDeltaCents;
    }
  }
  return delta;
}

export function calculateLineTotalCents(line: CartLine, item: MenuItem): number {
  const basePrice = item.basePriceCents;
  const modifierDelta = calculateModifierDeltaCents(item, line.selectedModifiers);
  const unitPrice = basePrice + modifierDelta;
  return unitPrice * line.quantity;
}

export function calculateSubtotalCents(state: CartState, menuItems: MenuItem[]): number {
  return state.lines.reduce((sum, line) => {
    const item = menuItems.find((m) => m.id === line.productId);
    if (!item) return sum;
    return sum + calculateLineTotalCents(line, item);
  }, 0);
}

export function calculateTaxCents(subtotalCents: number, taxRate: number = businessConfig.pricing.taxRate): number {
  return Math.round(subtotalCents * taxRate);
}

export function calculateDeliveryFeeCents(
  subtotalCents: number,
  isDelivery: boolean,
  config: typeof businessConfig = businessConfig
): number {
  if (!isDelivery) return 0;
  if (config.pricing.freeDeliveryThresholdCents && subtotalCents >= config.pricing.freeDeliveryThresholdCents) {
    return 0;
  }
  return config.pricing.deliveryFeeCents;
}

export function calculateTotalCents(
  subtotalCents: number,
  taxCents: number,
  deliveryFeeCents: number
): number {
  return subtotalCents + taxCents + deliveryFeeCents;
}

export interface PricingBreakdown {
  subtotalCents: number;
  taxCents: number;
  deliveryFeeCents: number;
  totalCents: number;
}

export function calculatePricingBreakdown(
  state: CartState,
  menuItems: MenuItem[],
  isDelivery: boolean,
  config: typeof businessConfig = businessConfig
): PricingBreakdown {
  const subtotalCents = calculateSubtotalCents(state, menuItems);
  const taxCents = calculateTaxCents(subtotalCents, config.pricing.taxRate);
  const deliveryFeeCents = calculateDeliveryFeeCents(subtotalCents, isDelivery, config);
  const totalCents = calculateTotalCents(subtotalCents, taxCents, deliveryFeeCents);

  return {
    subtotalCents,
    taxCents,
    deliveryFeeCents,
    totalCents,
  };
}

export function formatCents(cents: number, config: typeof businessConfig = businessConfig): string {
  return new Intl.NumberFormat(config.currency.locale, {
    style: "currency",
    currency: config.currency.code,
  }).format(cents / 100);
}

export function validateModifierSelection(
  item: MenuItem,
  selectedModifiers: SelectedModifier[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const group of item.modifierGroups ?? []) {
    const selectedForGroup = selectedModifiers.filter((m) => m.groupId === group.id);
    const count = selectedForGroup.length;

    if (group.required && count < group.minSelections) {
      errors.push(`${group.name}: please select at least ${group.minSelections} option(s)`);
    }
    if (count > group.maxSelections) {
      errors.push(`${group.name}: maximum ${group.maxSelections} selection(s) allowed`);
    }

    for (const selected of selectedForGroup) {
      const option = getModifierOption(group, selected.optionId);
      if (!option) {
        errors.push(`${group.name}: invalid selection`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

export function getRequiredGroups(item: MenuItem): ModifierGroup[] {
  return (item.modifierGroups ?? []).filter((g) => g.required && g.minSelections > 0);
}

export function hasRequiredGroups(item: MenuItem): boolean {
  return getRequiredGroups(item).length > 0;
}

export function getDefaultModifiers(item: MenuItem): SelectedModifier[] {
  const defaults: SelectedModifier[] = [];
  for (const group of item.modifierGroups ?? []) {
    const defaultOpt = group.options.find((opt) => opt.defaultSelected);
    if (defaultOpt) {
      defaults.push({ groupId: group.id, optionId: defaultOpt.id });
    }
  }
  return defaults;
}