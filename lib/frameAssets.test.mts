import assert from "node:assert/strict";
import test from "node:test";
import { buildFrameAssetUrl } from "./frameAssets.mjs";

test("frame URLs use the WebP delivery format and include an image-set version for cache invalidation", () => {
  assert.equal(
    buildFrameAssetUrl("/images/burger-build/frame-", 0, "burger-frames-v2"),
    "/images/burger-build/frame-001.webp?v=burger-frames-v2",
  );
});

test("frame URLs encode version values safely", () => {
  assert.equal(
    buildFrameAssetUrl("/images/burger-explosion/ezgif-frame-", 118, "set 2"),
    "/images/burger-explosion/ezgif-frame-119.webp?v=set%202",
  );
});

test("frame URLs use the compressed WebP delivery format", () => {
  assert.equal(
    buildFrameAssetUrl("/images/burger-build/frame-", 0, "burger-frames-v2"),
    "/images/burger-build/frame-001.webp?v=burger-frames-v2",
  );
});
