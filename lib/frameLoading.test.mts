import assert from "node:assert/strict";
import { test } from "node:test";

import {
  createSparseFrameOrder,
  findNearestLoadedFrame,
  prioritizeFrameNeighborhood,
} from "./frameLoading.mjs";

test("a missing target frame keeps the nearest loaded frame instead of falling back to frame zero", () => {
  const statuses = new Array(80).fill("idle");
  statuses[0] = "loaded";
  statuses[48] = "loaded";
  statuses[53] = "loaded";

  assert.equal(findNearestLoadedFrame(50, statuses), 48);
});

test("the current frame and its neighbors jump ahead of background frames", () => {
  const statuses = new Array(100).fill("idle");
  const queue = [10, 20, 30];
  for (const index of queue) statuses[index] = "queued";

  prioritizeFrameNeighborhood(queue, statuses, 51, 100, 2);

  assert.deepEqual(queue.slice(0, 5), [51, 52, 50, 53, 49]);
});

test("the initial background queue is sparse and includes both endpoints", () => {
  const order = createSparseFrameOrder(119, 12);

  assert.equal(order[0], 0);
  assert.equal(order.at(-1), 118);
  assert.ok(order.length < 15);
});
