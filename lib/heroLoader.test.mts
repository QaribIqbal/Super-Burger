import assert from "node:assert/strict";
import { test } from "node:test";

import { getHeroLoaderState } from "./heroLoader.mjs";

test("the hero loader tracks only the critical opening frames", () => {
  assert.deepEqual(getHeroLoaderState(7, 8, false), {
    percent: 88,
    visible: true,
    label: "Preparing your burger…",
  });

  assert.deepEqual(getHeroLoaderState(8, 8, true), {
    percent: 100,
    visible: false,
    label: "Ready",
  });
});
