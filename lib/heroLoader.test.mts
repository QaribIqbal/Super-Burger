import assert from "node:assert/strict";
import { test } from "node:test";

import { getHeroLoaderState } from "./heroLoader.mjs";

test("the hero loader only waits for its opening frame neighborhood", () => {
  assert.deepEqual(getHeroLoaderState(2, 3, false), {
    percent: 67,
    visible: true,
    label: "Loading the opening burger frames",
  });

  assert.deepEqual(getHeroLoaderState(3, 3, true), {
    percent: 100,
    visible: false,
    label: "Ready to scroll",
  });
});
