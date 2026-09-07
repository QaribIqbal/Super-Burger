export { businessConfig, type BusinessConfig, formatCurrency, formatPrice, getFullAddress, getOrderUrl, isOrderingEnabled, NAV_LINKS } from "./business-config";

import { businessConfig, getOrderUrl } from "./business-config";

export const ORDER_URL = getOrderUrl(businessConfig);
export const DELIVERY_PROMISE = "Free Home Delivery";
export const CURRENT_OFFER = "Today: 50% Off";
