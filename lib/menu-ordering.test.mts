import test from "node:test";
import assert from "node:assert/strict";
import { getMenuOrderAction, getStandardModifiers } from "./menu-ordering.mjs";

type TestItem = Parameters<typeof getMenuOrderAction>[0];

const item = (overrides: Partial<TestItem>): TestItem => ({
  id: "test-item",
  name: "Test item",
  description: "A test item",
  basePriceCents: 1000,
  category: "burgers",
  image: "/test.jpg",
  availability: "available",
  ...overrides,
});

test("required choices use Choose options instead of an arbitrary default", () => {
  assert.equal(getMenuOrderAction(item({
    modifierGroups: [{ id: "cheese", name: "Cheese", minSelections: 1, maxSelections: 1, required: true, options: [] }],
  })), "choose-options");
});

test("optional-only modifiers allow a standard add with defaults", () => {
  const product = item({
    modifierGroups: [{
      id: "sauce",
      name: "Sauce",
      minSelections: 0,
      maxSelections: 1,
      required: false,
      options: [{ id: "house", name: "House sauce", priceDeltaCents: 0, defaultSelected: true }],
    }],
  });

  assert.equal(getMenuOrderAction(product), "add");
  assert.deepEqual(getStandardModifiers(product), [{ groupId: "sauce", optionId: "house" }]);
});

test("unavailable products cannot be ordered", () => {
  assert.equal(getMenuOrderAction(item({ availability: "unavailable" })), "unavailable");
});
