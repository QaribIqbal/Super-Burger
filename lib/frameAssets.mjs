// Bump this value only when a source frame changes; unchanged deploys keep using the warm cache.
export const FRAME_ASSET_VERSION = "burger-frames-2026-09-08-webp-1";

/**
 * @param {string} frameDir
 * @param {number} zeroBasedIndex
 * @param {string} assetVersion
 */
export function buildFrameAssetUrl(frameDir, zeroBasedIndex, assetVersion) {
  const frameNumber = String(zeroBasedIndex + 1).padStart(3, "0");
  return `${frameDir}${frameNumber}.webp?v=${encodeURIComponent(assetVersion)}`;
}
