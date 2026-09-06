/** @typedef {"idle" | "queued" | "loading" | "loaded" | "error"} FrameStatus */

/**
 * @param {number} target
 * @param {readonly FrameStatus[]} statuses
 */
export function findNearestLoadedFrame(target, statuses) {
  if (statuses[target] === "loaded") return target;

  for (let distance = 1; distance < statuses.length; distance += 1) {
    const before = target - distance;
    const after = target + distance;
    if (before >= 0 && statuses[before] === "loaded") return before;
    if (after < statuses.length && statuses[after] === "loaded") return after;
  }

  return null;
}

/**
 * @param {number[]} queue
 * @param {FrameStatus[]} statuses
 * @param {number} target
 * @param {number} frameCount
 * @param {number} radius
 */
export function prioritizeFrameNeighborhood(queue, statuses, target, frameCount, radius) {
  /** @type {number[]} */
  const priorityOrder = [];

  for (let distance = 0; distance <= radius; distance += 1) {
    const candidates = distance === 0 ? [target] : [target + distance, target - distance];

    for (const index of candidates) {
      if (index < 0 || index >= frameCount) continue;
      if (statuses[index] === "idle") statuses[index] = "queued";
      if (statuses[index] === "queued") priorityOrder.push(index);
    }
  }

  const prioritySet = new Set(priorityOrder);
  const backgroundFrames = queue.filter((index) => !prioritySet.has(index));
  queue.splice(0, queue.length, ...priorityOrder, ...backgroundFrames);
}

/**
 * @param {number} frameCount
 * @param {number} stride
 */
export function createSparseFrameOrder(frameCount, stride) {
  if (frameCount <= 0) return [];

  /** @type {number[]} */
  const order = [];
  for (let index = 0; index < frameCount; index += stride) order.push(index);
  if (order.at(-1) !== frameCount - 1) order.push(frameCount - 1);
  return order;
}
