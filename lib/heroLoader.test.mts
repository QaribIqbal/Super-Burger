import assert from "node:assert/strict";
import { test } from "node:test";

import { getHeroLoaderState } from "./heroLoader.mjs";

test("the hero loader stays visible until every frame is ready", () => {
  assert.deepEqual(getHeroLoaderState(298, 299, false), {
    percent: 100,
    visible: true,
    label: "Loading the full burger build",
  });

  assert.deepEqual(getHeroLoaderState(299, 299, true), {
    percent: 100,
    visible: false,
    label: "Ready to scroll",
  });
});
