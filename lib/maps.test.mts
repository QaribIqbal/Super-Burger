import assert from "node:assert/strict";
import test from "node:test";

import { buildGoogleMapsEmbedUrl } from "./maps.mjs";

test("Google Maps embeds the complete configured address", () => {
  assert.equal(
    buildGoogleMapsEmbedUrl("123 Burger Lane, Flavor Town, FT 12345, US"),
    "https://www.google.com/maps?q=123+Burger+Lane%2C+Flavor+Town%2C+FT+12345%2C+US&output=embed",
  );
});
