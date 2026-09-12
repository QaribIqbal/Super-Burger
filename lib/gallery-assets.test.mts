import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const galleryDirectory = join(process.cwd(), "public", "images", "gallery");

test("all gallery image assets are present locally", () => {
  const requiredAssets = [
    "classic-burger-2026.webp",
    "crispy-chicken-burger.webp",
    "fries.webp",
    "chocolate-malt.webp",
  ];

  for (const asset of requiredAssets) {
    assert.equal(existsSync(join(galleryDirectory, asset)), true, `${asset} should exist`);
  }
});

test("the location section has a local map image fallback", () => {
  assert.equal(
    existsSync(join(process.cwd(), "public", "images", "location", "city-map.webp")),
    true,
    "city-map.webp should exist",
  );
});
