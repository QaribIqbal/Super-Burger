export type Allergen =
  | "gluten"
  | "dairy"
  | "eggs"
  | "soy"
  | "nuts"
  | "peanuts"
  | "shellfish"
  | "fish"
  | "sesame"
  | "mustard"
  | "celery"
  | "lupin"
  | "mollusks"
  | "sulphites";

export type DietaryTag = "vegetarian" | "vegan" | "gluten-free" | "keto" | "halal";

export type MenuTag = "spicy" | "popular" | "vegetarian" | "new" | "limited";

export type AvailabilityStatus = "available" | "limited" | "unavailable" | "hidden";

export interface ModifierOption {
  id: string;
  name: string;
  description?: string;
  priceDeltaCents: number;
  allergens?: Allergen[];
  dietaryTags?: DietaryTag[];
  defaultSelected?: boolean;
}

export interface ModifierGroup {
  id: string;
  name: string;
  description?: string;
  minSelections: number;
  maxSelections: number;
  required: boolean;
  options: ModifierOption[];
}

export interface SelectedModifier {
  groupId: string;
  optionId: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  basePriceCents: number;
  category: "burgers" | "sides" | "drinks" | "combos";
  image: string;
  tags?: MenuTag[];
  allergens?: Allergen[];
  dietaryTags?: DietaryTag[];
  modifierGroups?: ModifierGroup[];
  availability: AvailabilityStatus;
  popularIndex?: number;
}

export const categories = [
  { id: "burgers", label: "Burgers" },
  { id: "sides", label: "Sides" },
  { id: "drinks", label: "Drinks" },
  { id: "combos", label: "Combos" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

const cheeseSlice: ModifierOption = {
  id: "cheese-american",
  name: "American Cheese",
  priceDeltaCents: 0,
  defaultSelected: true,
};
const cheeseCheddar: ModifierOption = {
  id: "cheese-cheddar",
  name: "Aged Cheddar",
  priceDeltaCents: 50,
};
const cheeseSwiss: ModifierOption = {
  id: "cheese-swiss",
  name: "Swiss Cheese",
  priceDeltaCents: 50,
};
const cheeseBlue: ModifierOption = {
  id: "cheese-blue",
  name: "Blue Cheese Crumbles",
  priceDeltaCents: 100,
};
const cheeseNone: ModifierOption = {
  id: "cheese-none",
  name: "No Cheese",
  priceDeltaCents: 0,
};

const bunRegular: ModifierOption = {
  id: "bun-sesame",
  name: "Sesame Bun",
  priceDeltaCents: 0,
  defaultSelected: true,
};
const bunBrioche: ModifierOption = {
  id: "bun-brioche",
  name: "Brioche Bun",
  priceDeltaCents: 50,
};
const bunWheat: ModifierOption = {
  id: "bun-wheat",
  name: "Whole Wheat Bun",
  priceDeltaCents: 50,
};
const bunLettuce: ModifierOption = {
  id: "bun-lettuce",
  name: "Lettuce Wrap",
  priceDeltaCents: 0,
};

const pattyDouble: ModifierOption = {
  id: "patty-double",
  name: "Double Patty",
  priceDeltaCents: 300,
  defaultSelected: true,
};
const pattySingle: ModifierOption = {
  id: "patty-single",
  name: "Single Patty",
  priceDeltaCents: 0,
};
const pattyTriple: ModifierOption = {
  id: "patty-triple",
  name: "Triple Patty",
  priceDeltaCents: 600,
};

const sauceHouse: ModifierOption = {
  id: "sauce-house",
  name: "House Sauce",
  priceDeltaCents: 0,
  defaultSelected: true,
};
const sauceSpicy: ModifierOption = {
  id: "sauce-spicy",
  name: "Spicy Chipotle Mayo",
  priceDeltaCents: 0,
};
const sauceBBQ: ModifierOption = {
  id: "sauce-bbq",
  name: "Smoky BBQ",
  priceDeltaCents: 0,
};
const sauceRanch: ModifierOption = {
  id: "sauce-ranch",
  name: "Ranch",
  priceDeltaCents: 0,
};
const sauceNone: ModifierOption = {
  id: "sauce-none",
  name: "No Sauce",
  priceDeltaCents: 0,
};

const sideFries: ModifierOption = {
  id: "side-fries",
  name: "Crinkle-Cut Fries",
  priceDeltaCents: 0,
  defaultSelected: true,
};
const sideRings: ModifierOption = {
  id: "side-rings",
  name: "Beer-Battered Onion Rings",
  priceDeltaCents: 100,
};
const sideCurds: ModifierOption = {
  id: "side-curds",
  name: "Fried Cheese Curds",
  priceDeltaCents: 200,
};
const sideSalad: ModifierOption = {
  id: "side-salad",
  name: "Side Salad",
  priceDeltaCents: 50,
};

const drinkFountain: ModifierOption = {
  id: "drink-fountain",
  name: "Fountain Drink",
  priceDeltaCents: 0,
  defaultSelected: true,
};
const drinkShake: ModifierOption = {
  id: "drink-shake",
  name: "Chocolate Malt Shake",
  priceDeltaCents: 200,
};
const drinkColdBrew: ModifierOption = {
  id: "drink-coldbrew",
  name: "Nitro Cold Brew",
  priceDeltaCents: 150,
};

export const menuItems: MenuItem[] = [
  {
    id: "double-smash",
    name: "Double Smash Burger",
    description:
      "Two smashed patties, American cheese, grilled onions, pickles, house sauce on a toasted sesame bun",
    basePriceCents: 1450,
    category: "burgers",
    image: "/images/gallery/classic-burger-2026.jpg",
    tags: ["popular"],
    allergens: ["gluten", "dairy", "eggs", "sesame", "mustard"],
    dietaryTags: [],
    modifierGroups: [
      {
        id: "cheese",
        name: "Cheese",
        description: "Choose your cheese",
        minSelections: 1,
        maxSelections: 1,
        required: true,
        options: [cheeseSlice, cheeseCheddar, cheeseSwiss, cheeseBlue, cheeseNone],
      },
      {
        id: "bun",
        name: "Bun",
        description: "Choose your bun",
        minSelections: 1,
        maxSelections: 1,
        required: true,
        options: [bunRegular, bunBrioche, bunWheat, bunLettuce],
      },
      {
        id: "patty",
        name: "Patty Count",
        description: "How many patties?",
        minSelections: 1,
        maxSelections: 1,
        required: true,
        options: [pattySingle, pattyDouble, pattyTriple],
      },
      {
        id: "sauce",
        name: "Sauce",
        description: "Pick your sauce",
        minSelections: 0,
        maxSelections: 2,
        required: false,
        options: [sauceHouse, sauceSpicy, sauceBBQ, sauceRanch, sauceNone],
      },
    ],
    availability: "available",
    popularIndex: 0,
  },
  {
    id: "spicy-crispy",
    name: "Spicy Crispy Chicken",
    description:
      "Buttermilk-brined crispy chicken, spicy slaw, pickles, chipotle mayo on a brioche bun",
    basePriceCents: 1350,
    category: "burgers",
    image: "/images/gallery/crispy-chicken-burger.jpg",
    tags: ["spicy", "popular"],
    allergens: ["gluten", "dairy", "eggs", "soy"],
    dietaryTags: [],
    modifierGroups: [
      {
        id: "bun",
        name: "Bun",
        description: "Choose your bun",
        minSelections: 1,
        maxSelections: 1,
        required: true,
        options: [bunBrioche, bunRegular, bunWheat, bunLettuce],
      },
      {
        id: "spice-level",
        name: "Spice Level",
        description: "How hot?",
        minSelections: 1,
        maxSelections: 1,
        required: true,
        options: [
          { id: "spice-mild", name: "Mild", priceDeltaCents: 0, defaultSelected: true },
          { id: "spice-medium", name: "Medium", priceDeltaCents: 0 },
          { id: "spice-hot", name: "Extra Hot", priceDeltaCents: 0 },
        ],
      },
      {
        id: "sauce",
        name: "Sauce",
        description: "Pick your sauce",
        minSelections: 0,
        maxSelections: 2,
        required: false,
        options: [sauceSpicy, sauceRanch, sauceHouse, sauceBBQ, sauceNone],
      },
    ],
    availability: "available",
    popularIndex: 1,
  },
  {
    id: "veggie-stack",
    name: "Veggie Stack",
    description:
      "Grilled portobello, roasted red pepper, arugula, goat cheese, basil aioli on a whole wheat bun",
    basePriceCents: 1250,
    category: "burgers",
    image: "/images/gallery/classic-burger-2026.jpg",
    tags: ["vegetarian"],
    allergens: ["gluten", "dairy", "eggs", "nuts"],
    dietaryTags: ["vegetarian"],
    modifierGroups: [
      {
        id: "bun",
        name: "Bun",
        description: "Choose your bun",
        minSelections: 1,
        maxSelections: 1,
        required: true,
        options: [bunWheat, bunRegular, bunBrioche, bunLettuce],
      },
      {
        id: "cheese",
        name: "Cheese",
        description: "Choose your cheese",
        minSelections: 1,
        maxSelections: 1,
        required: true,
        options: [
          { id: "cheese-goat", name: "Goat Cheese", priceDeltaCents: 0, defaultSelected: true, allergens: ["dairy"] },
          { id: "cheese-vegan", name: "Vegan Cheese", priceDeltaCents: 100, dietaryTags: ["vegan"] },
          { id: "cheese-none", name: "No Cheese", priceDeltaCents: 0 },
        ],
      },
      {
        id: "sauce",
        name: "Sauce",
        description: "Pick your sauce",
        minSelections: 0,
        maxSelections: 2,
        required: false,
        options: [
          { id: "sauce-basil", name: "Basil Aioli", priceDeltaCents: 0, defaultSelected: true, allergens: ["eggs"] },
          { id: "sauce-house", name: "House Sauce", priceDeltaCents: 0, allergens: ["eggs", "mustard"] },
          { id: "sauce-none", name: "No Sauce", priceDeltaCents: 0 },
        ],
      },
    ],
    availability: "available",
  },
  {
    id: "bacon-cheddar",
    name: "Bacon Cheddar Smash",
    description:
      "Smashed patty, aged cheddar, thick-cut bacon, caramelized onions, smoky BBQ sauce",
    basePriceCents: 1550,
    category: "burgers",
    image: "/images/gallery/classic-burger-2026.jpg",
    tags: ["popular"],
    allergens: ["gluten", "dairy", "eggs", "sesame", "soy"],
    dietaryTags: [],
    modifierGroups: [
      {
        id: "cheese",
        name: "Cheese",
        description: "Choose your cheese",
        minSelections: 1,
        maxSelections: 1,
        required: true,
        options: [cheeseCheddar, cheeseSlice, cheeseSwiss, cheeseBlue, cheeseNone],
      },
      {
        id: "bun",
        name: "Bun",
        description: "Choose your bun",
        minSelections: 1,
        maxSelections: 1,
        required: true,
        options: [bunRegular, bunBrioche, bunWheat, bunLettuce],
      },
      {
        id: "patty",
        name: "Patty Count",
        description: "How many patties?",
        minSelections: 1,
        maxSelections: 1,
        required: true,
        options: [pattySingle, pattyDouble, pattyTriple],
      },
      {
        id: "sauce",
        name: "Sauce",
        description: "Pick your sauce",
        minSelections: 0,
        maxSelections: 2,
        required: false,
        options: [sauceBBQ, sauceHouse, sauceSpicy, sauceRanch, sauceNone],
      },
    ],
    availability: "available",
    popularIndex: 2,
  },
  {
    id: "crinkle-fries",
    name: "Crinkle-Cut Fries",
    description: "Golden crinkle-cut fries with sea salt, served with house ketchup",
    basePriceCents: 450,
    category: "sides",
    image: "/images/gallery/fries.jpg",
    tags: ["vegetarian"],
    allergens: [],
    dietaryTags: ["vegetarian", "vegan", "gluten-free"],
    modifierGroups: [
      {
        id: "seasoning",
        name: "Seasoning",
        description: "Pick your seasoning",
        minSelections: 1,
        maxSelections: 1,
        required: true,
        options: [
          { id: "season-salt", name: "Sea Salt", priceDeltaCents: 0, defaultSelected: true },
          { id: "season-cajun", name: "Cajun", priceDeltaCents: 0 },
          { id: "season-garlic", name: "Garlic Parm", priceDeltaCents: 50, allergens: ["dairy"] },
          { id: "season-truffle", name: "Truffle Oil", priceDeltaCents: 100 },
        ],
      },
      {
        id: "dip",
        name: "Dipping Sauce",
        description: "Choose up to 2 dipping sauces",
        minSelections: 0,
        maxSelections: 2,
        required: false,
        options: [
          { id: "dip-ketchup", name: "House Ketchup", priceDeltaCents: 0, defaultSelected: true },
          { id: "dip-mayo", name: "Garlic Mayo", priceDeltaCents: 0, allergens: ["eggs"] },
          { id: "dip-bbq", name: "Smoky BBQ", priceDeltaCents: 0 },
          { id: "dip-ranch", name: "Ranch", priceDeltaCents: 0, allergens: ["dairy", "eggs"] },
          { id: "dip-honey", name: "Honey Mustard", priceDeltaCents: 0, allergens: ["mustard"] },
          { id: "dip-none", name: "No Sauce", priceDeltaCents: 0 },
        ],
      },
    ],
    availability: "available",
  },
  {
    id: "onion-rings",
    name: "Beer-Battered Onion Rings",
    description: "Thick-cut onions in crisp beer batter, served with ranch",
    basePriceCents: 550,
    category: "sides",
    image: "/images/gallery/fries.jpg",
    tags: ["vegetarian"],
    allergens: ["gluten", "dairy", "eggs"],
    dietaryTags: ["vegetarian"],
    modifierGroups: [
      {
        id: "dip",
        name: "Dipping Sauce",
        description: "Choose up to 2 dipping sauces",
        minSelections: 0,
        maxSelections: 2,
        required: false,
        options: [
          { id: "dip-ranch", name: "Ranch", priceDeltaCents: 0, defaultSelected: true, allergens: ["dairy", "eggs"] },
          { id: "dip-bbq", name: "Smoky BBQ", priceDeltaCents: 0 },
          { id: "dip-spicy", name: "Spicy Mayo", priceDeltaCents: 0, allergens: ["eggs"] },
          { id: "dip-none", name: "No Sauce", priceDeltaCents: 0 },
        ],
      },
    ],
    availability: "available",
  },
  {
    id: "cheese-curds",
    name: "Fried Cheese Curds",
    description: "Wisconsin white cheddar curds, lightly breaded, served with marinara",
    basePriceCents: 650,
    category: "sides",
    image: "/images/gallery/fries.jpg",
    tags: ["vegetarian", "popular"],
    allergens: ["gluten", "dairy", "eggs"],
    dietaryTags: ["vegetarian"],
    modifierGroups: [
      {
        id: "dip",
        name: "Dipping Sauce",
        description: "Choose up to 2 dipping sauces",
        minSelections: 0,
        maxSelections: 2,
        required: false,
        options: [
          { id: "dip-marinara", name: "Marinara", priceDeltaCents: 0, defaultSelected: true },
          { id: "dip-ranch", name: "Ranch", priceDeltaCents: 0, allergens: ["dairy", "eggs"] },
          { id: "dip-spicy", name: "Spicy Mayo", priceDeltaCents: 0, allergens: ["eggs"] },
          { id: "dip-none", name: "No Sauce", priceDeltaCents: 0 },
        ],
      },
    ],
    availability: "available",
  },
  {
    id: "chocolate-shake",
    name: "Chocolate Malt Shake",
    description: "Rich chocolate ice cream, malt powder, whipped cream, cherry",
    basePriceCents: 650,
    category: "drinks",
    image: "/images/gallery/chocolate-malt.jpg",
    tags: ["vegetarian"],
    allergens: ["dairy", "eggs", "gluten"],
    dietaryTags: ["vegetarian"],
    modifierGroups: [
      {
        id: "topping",
        name: "Toppings",
        description: "Add extra toppings",
        minSelections: 0,
        maxSelections: 3,
        required: false,
        options: [
          { id: "top-whipped", name: "Extra Whipped Cream", priceDeltaCents: 0, defaultSelected: true, allergens: ["dairy"] },
          { id: "top-cherry", name: "Cherry", priceDeltaCents: 0, defaultSelected: true },
          { id: "top-chocolate", name: "Chocolate Chips", priceDeltaCents: 50, allergens: ["dairy", "soy"] },
          { id: "top-malt", name: "Extra Malt Powder", priceDeltaCents: 0 },
        ],
      },
    ],
    availability: "available",
  },
  {
    id: "vanilla-shake",
    name: "Vanilla Bean Shake",
    description: "Madagascar vanilla ice cream, whole milk, whipped cream",
    basePriceCents: 600,
    category: "drinks",
    image: "/images/gallery/chocolate-malt.jpg",
    tags: ["vegetarian"],
    allergens: ["dairy", "eggs"],
    dietaryTags: ["vegetarian"],
    modifierGroups: [
      {
        id: "topping",
        name: "Toppings",
        description: "Add extra toppings",
        minSelections: 0,
        maxSelections: 3,
        required: false,
        options: [
          { id: "top-whipped", name: "Extra Whipped Cream", priceDeltaCents: 0, defaultSelected: true, allergens: ["dairy"] },
          { id: "top-sprinkles", name: "Rainbow Sprinkles", priceDeltaCents: 50 },
          { id: "top-chocolate", name: "Chocolate Chips", priceDeltaCents: 50, allergens: ["dairy", "soy"] },
          { id: "top-caramel", name: "Caramel Drizzle", priceDeltaCents: 50, allergens: ["dairy"] },
        ],
      },
    ],
    availability: "available",
  },
  {
    id: "cold-brew",
    name: "Nitro Cold Brew",
    description: "Steeped 18 hours, served on tap, creamy cascade",
    basePriceCents: 450,
    category: "drinks",
    image: "/images/gallery/chocolate-malt.jpg",
    tags: ["vegetarian"],
    allergens: [],
    dietaryTags: ["vegetarian", "vegan", "gluten-free", "keto"],
    modifierGroups: [
      {
        id: "milk",
        name: "Milk",
        description: "Add milk or alternative",
        minSelections: 0,
        maxSelections: 1,
        required: false,
        options: [
          { id: "milk-none", name: "Black", priceDeltaCents: 0, defaultSelected: true, dietaryTags: ["vegan", "keto"] },
          { id: "milk-oat", name: "Oat Milk", priceDeltaCents: 50, dietaryTags: ["vegan"] },
          { id: "milk-almond", name: "Almond Milk", priceDeltaCents: 50, dietaryTags: ["vegan"], allergens: ["nuts"] },
          { id: "milk-whole", name: "Whole Milk", priceDeltaCents: 50, allergens: ["dairy"] },
        ],
      },
      {
        id: "sweetener",
        name: "Sweetener",
        description: "Add sweetener",
        minSelections: 0,
        maxSelections: 1,
        required: false,
        options: [
          { id: "sweet-none", name: "None", priceDeltaCents: 0, defaultSelected: true },
          { id: "sweet-simple", name: "Simple Syrup", priceDeltaCents: 0 },
          { id: "sweet-vanilla", name: "Vanilla Syrup", priceDeltaCents: 50 },
          { id: "sweet-caramel", name: "Caramel Syrup", priceDeltaCents: 50, allergens: ["dairy"] },
        ],
      },
    ],
    availability: "available",
  },
  {
    id: "combo-classic",
    name: "Classic Combo",
    description: "Double Smash Burger, crinkle fries, fountain drink",
    basePriceCents: 1850,
    category: "combos",
    image: "/images/gallery/classic-burger-2026.jpg",
    tags: ["popular"],
    allergens: ["gluten", "dairy", "eggs", "sesame", "mustard"],
    dietaryTags: [],
    modifierGroups: [
      {
        id: "burger-cheese",
        name: "Burger Cheese",
        description: "Choose cheese for the burger",
        minSelections: 1,
        maxSelections: 1,
        required: true,
        options: [cheeseSlice, cheeseCheddar, cheeseSwiss, cheeseBlue, cheeseNone],
      },
      {
        id: "burger-bun",
        name: "Burger Bun",
        description: "Choose bun for the burger",
        minSelections: 1,
        maxSelections: 1,
        required: true,
        options: [bunRegular, bunBrioche, bunWheat, bunLettuce],
      },
      {
        id: "side",
        name: "Side",
        description: "Choose your side",
        minSelections: 1,
        maxSelections: 1,
        required: true,
        options: [sideFries, sideRings, sideCurds, sideSalad],
      },
      {
        id: "drink",
        name: "Drink",
        description: "Choose your drink",
        minSelections: 1,
        maxSelections: 1,
        required: true,
        options: [drinkFountain, drinkShake, drinkColdBrew],
      },
    ],
    availability: "available",
    popularIndex: 3,
  },
  {
    id: "combo-spicy",
    name: "Spicy Combo",
    description: "Spicy Crispy Chicken, onion rings, chocolate shake",
    basePriceCents: 2200,
    category: "combos",
    image: "/images/gallery/crispy-chicken-burger.jpg",
    tags: ["spicy"],
    allergens: ["gluten", "dairy", "eggs", "soy"],
    dietaryTags: [],
    modifierGroups: [
      {
        id: "burger-bun",
        name: "Burger Bun",
        description: "Choose bun for the chicken sandwich",
        minSelections: 1,
        maxSelections: 1,
        required: true,
        options: [bunBrioche, bunRegular, bunWheat, bunLettuce],
      },
      {
        id: "spice-level",
        name: "Spice Level",
        description: "How hot?",
        minSelections: 1,
        maxSelections: 1,
        required: true,
        options: [
          { id: "spice-mild", name: "Mild", priceDeltaCents: 0, defaultSelected: true },
          { id: "spice-medium", name: "Medium", priceDeltaCents: 0 },
          { id: "spice-hot", name: "Extra Hot", priceDeltaCents: 0 },
        ],
      },
      {
        id: "side",
        name: "Side",
        description: "Choose your side",
        minSelections: 1,
        maxSelections: 1,
        required: true,
        options: [sideRings, sideFries, sideCurds, sideSalad],
      },
      {
        id: "drink",
        name: "Drink",
        description: "Choose your drink",
        minSelections: 1,
        maxSelections: 1,
        required: true,
        options: [drinkShake, drinkFountain, drinkColdBrew],
      },
    ],
    availability: "available",
  },
];

export function getItemsByCategory(category: CategoryId): MenuItem[] {
  return menuItems.filter((item) => item.category === category);
}

export function getItemById(id: string): MenuItem | undefined {
  return menuItems.find((item) => item.id === id);
}

export function getAvailableItems(): MenuItem[] {
  return menuItems.filter((item) => item.availability !== "unavailable" && item.availability !== "hidden");
}

export function getSignaturePicks(): MenuItem[] {
  return menuItems
    .filter((item) => item.tags?.includes("popular") && item.availability === "available")
    .sort((a, b) => (a.popularIndex ?? 99) - (b.popularIndex ?? 99))
    .slice(0, 4);
}

export function getAllAllergens(): Allergen[] {
  const allergens = new Set<Allergen>();
  menuItems.forEach((item) => {
    item.allergens?.forEach((a) => allergens.add(a));
    item.modifierGroups?.forEach((group) => {
      group.options.forEach((opt) => opt.allergens?.forEach((a) => allergens.add(a)));
    });
  });
  return Array.from(allergens).sort();
}

export function getAllDietaryTags(): DietaryTag[] {
  const tags = new Set<DietaryTag>();
  menuItems.forEach((item) => {
    item.dietaryTags?.forEach((t) => tags.add(t));
    item.modifierGroups?.forEach((group) => {
      group.options.forEach((opt) => opt.dietaryTags?.forEach((t) => tags.add(t)));
    });
  });
  return Array.from(tags).sort();
}
