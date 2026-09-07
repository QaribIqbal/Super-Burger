/**
 * Builds an API-key-free Google Maps embed URL from a configured street address.
 * @param {string} address
 */
export function buildGoogleMapsEmbedUrl(address) {
  return `https://www.google.com/maps?q=${encodeURIComponent(address).replace(/%20/g, "+")}&output=embed`;
}
