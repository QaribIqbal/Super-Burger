export interface BusinessConfig {
  brand: {
    name: string;
    tagline: string;
    description: string;
  };
  currency: {
    code: string;
    locale: string;
    symbol: string;
  };
  pricing: {
    taxRate: number;
    deliveryFeeCents: number;
    freeDeliveryThresholdCents: number | null;
  };
  contact: {
    address: {
      street: string;
      city: string;
      region: string;
      postalCode: string;
      country: string;
    };
    phone: string;
    email: string;
    hours: {
      monday: { open: string; close: string };
      tuesday: { open: string; close: string };
      wednesday: { open: string; close: string };
      thursday: { open: string; close: string };
      friday: { open: string; close: string };
      saturday: { open: string; close: string };
      sunday: { open: string; close: string };
    };
  };
  social: {
    instagram: string | null;
    twitter: string | null;
    tiktok: string | null;
    facebook: string | null;
  };
  ordering: {
    enabled: boolean;
    pickupEnabled: boolean;
    deliveryEnabled: boolean;
    orderUrl: string | null;
    demoMode: boolean;
  };
  features: {
    newsletterEnabled: boolean;
    galleryEnabled: boolean;
    mapEmbedEnabled: boolean;
  };
  legal: {
    privacyUrl: string | null;
    termsUrl: string | null;
    accessibilityUrl: string | null;
  };
  demo: {
    orderConfirmationMessage: string;
    noPaymentCollectedMessage: string;
  };
}

export const businessConfig: BusinessConfig = {
  brand: {
    name: "Super Burger Co.",
    tagline: "Built Right.",
    description: "Fresh-grilled, double-stacked burgers built layer by layer.",
  },
  currency: {
    code: "USD",
    locale: "en-US",
    symbol: "$",
  },
  pricing: {
    taxRate: 0.0875,
    deliveryFeeCents: 399,
    freeDeliveryThresholdCents: 2500,
  },
  contact: {
    address: {
      street: "123 Burger Lane",
      city: "Flavor Town",
      region: "FT",
      postalCode: "12345",
      country: "US",
    },
    phone: "+1 (234) 567-890",
    email: "hello@superburgerco.com",
    hours: {
      monday: { open: "11:00", close: "22:00" },
      tuesday: { open: "11:00", close: "22:00" },
      wednesday: { open: "11:00", close: "22:00" },
      thursday: { open: "11:00", close: "22:00" },
      friday: { open: "11:00", close: "23:00" },
      saturday: { open: "11:00", close: "23:00" },
      sunday: { open: "12:00", close: "21:00" },
    },
  },
  social: {
    instagram: "https://instagram.com/superburgerco",
    twitter: "https://twitter.com/superburgerco",
    tiktok: "https://tiktok.com/@superburgerco",
    facebook: null,
  },
  ordering: {
    enabled: true,
    pickupEnabled: true,
    deliveryEnabled: true,
    orderUrl: null,
    demoMode: true,
  },
  features: {
    newsletterEnabled: true,
    galleryEnabled: true,
    mapEmbedEnabled: false,
  },
  legal: {
    privacyUrl: "/privacy",
    termsUrl: "/terms",
    accessibilityUrl: "/accessibility",
  },
  demo: {
    orderConfirmationMessage: "This is a demonstration order. No payment was collected and no restaurant received this request.",
    noPaymentCollectedMessage: "No payment was collected for this demo order.",
  },
};

export const NAV_LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/#story", label: "Our Story" },
  { href: "/#how-its-made", label: "How It's Made" },
  { href: "/#locations", label: "Locations" },
] as const;

export function formatCurrency(cents: number, config: BusinessConfig = businessConfig): string {
  return new Intl.NumberFormat(config.currency.locale, {
    style: "currency",
    currency: config.currency.code,
  }).format(cents / 100);
}

export function formatPrice(price: number, config: BusinessConfig = businessConfig): string {
  return formatCurrency(Math.round(price * 100), config);
}

export function getFullAddress(config: BusinessConfig = businessConfig): string {
  const { street, city, region, postalCode, country } = config.contact.address;
  return `${street}, ${city}, ${region} ${postalCode}, ${country}`;
}

export function getOrderUrl(config: BusinessConfig = businessConfig): string | null {
  return config.ordering.orderUrl;
}

export function isOrderingEnabled(config: BusinessConfig = businessConfig): boolean {
  return config.ordering.enabled && (config.ordering.pickupEnabled || config.ordering.deliveryEnabled);
}
