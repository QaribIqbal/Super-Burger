import assert from "node:assert/strict";
import test from "node:test";
import { buildFrameAssetUrl } from "./frameAssets.mjs";

test("frame URLs include an image-set version for cache invalidation", () => {
  assert.equal(
    buildFrameAssetUrl("/images/burger-build/frame-", 0, "burger-frames-v2"),
    "/images/burger-build/frame-001.png?v=burger-frames-v2",
  );
});

test("frame URLs encode version values safely", () => {
  assert.equal(
    buildFrameAssetUrl("/images/burger-explosion/ezgif-frame-", 118, "set 2"),
    "/images/burger-explosion/ezgif-frame-119.png?v=set%202",
  );
});
