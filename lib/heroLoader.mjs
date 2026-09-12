/**
 * @param {number} loaded   Number of critical frames loaded so far
 * @param {number} total    Critical frame count threshold (not total 299)
 * @param {boolean} ready   True once the critical set is fully loaded
 */
export function getHeroLoaderState(loaded, total, ready) {
  const percent = total > 0 ? Math.min(100, Math.round((loaded / total) * 100)) : 0;
  return {
    percent,
    visible: !ready,
    label: ready ? "Ready" : "Preparing your burger…",
  };
}
