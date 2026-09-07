import type { CheckoutFormData } from "./checkout";
import { businessConfig } from "./business-config";

export interface OrderConfirmation {
  orderId: string;
  timestamp: string;
  estimatedReadyTime: string;
  fulfillmentMethod: "pickup" | "delivery";
  items: OrderConfirmationItem[];
  subtotalCents: number;
  taxCents: number;
  deliveryFeeCents: number;
  totalCents: number;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  demo: boolean;
  demoMessage: string;
}

export interface OrderConfirmationItem {
  name: string;
  quantity: number;
  modifiers: string[];
  specialInstructions: string;
  lineTotalCents: number;
}

export interface DemoOrderAdapter {
  submitOrder(formData: CheckoutFormData, pricing: PricingInput): Promise<OrderConfirmation>;
}

export interface PricingInput {
  subtotalCents: number;
  taxCents: number;
  deliveryFeeCents: number;
  totalCents: number;
}

function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SBC-${timestamp}-${random}`;
}

function generateEstimatedReadyTime(fulfillmentMethod: "pickup" | "delivery"): string {
  const now = new Date();
  const minutes = fulfillmentMethod === "pickup" ? 15 : 30;
  now.setMinutes(now.getMinutes() + minutes);
  return now.toISOString();
}

export const demoOrderAdapter: DemoOrderAdapter = {
  async submitOrder(formData, pricing) {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const orderId = generateOrderId();
    const timestamp = new Date().toISOString();

    return {
      orderId,
      timestamp,
      estimatedReadyTime: generateEstimatedReadyTime(formData.fulfillmentMethod),
      fulfillmentMethod: formData.fulfillmentMethod,
      items: [],
      subtotalCents: pricing.subtotalCents,
      taxCents: pricing.taxCents,
      deliveryFeeCents: pricing.deliveryFeeCents,
      totalCents: pricing.totalCents,
      customer: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
      },
      demo: true,
      demoMessage: businessConfig.demo.orderConfirmationMessage,
    };
  },
};

export function createFailingDemoAdapter(errorMessage: string): DemoOrderAdapter {
  return {
    async submitOrder() {
      await new Promise((resolve) => setTimeout(resolve, 500));
      throw new Error(errorMessage);
    },
  };
}

export function createSlowDemoAdapter(delayMs: number): DemoOrderAdapter {
  return {
    async submitOrder(formData, pricing) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return demoOrderAdapter.submitOrder(formData, pricing);
    },
  };
}