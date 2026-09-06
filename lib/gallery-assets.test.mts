import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const galleryDirectory = join(process.cwd(), "public", "images", "gallery");

test("all gallery image assets are present locally", () => {
  const requiredAssets = [
    "classic-burger-2026.jpg",
    "crispy-chicken-burger.jpg",
    "fries.jpg",
    "chocolate-malt.jpg",
  ];

  for (const asset of requiredAssets) {
    assert.equal(existsSync(join(galleryDirectory, asset)), true, `${asset} should exist`);
  }
});
