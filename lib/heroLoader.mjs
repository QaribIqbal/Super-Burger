/**
 * @param {number} loaded
 * @param {number} total
 * @param {boolean} ready
 */
export function getHeroLoaderState(loaded, total, ready) {
  const percent = total > 0 ? Math.min(100, Math.round((loaded / total) * 100)) : 0;
  return {
    percent,
    visible: !ready,
    label: ready ? "Ready to scroll" : "Loading the full burger build",
  };
}
