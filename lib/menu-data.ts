export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "burgers" | "sides" | "drinks" | "combos";
  image: string;
  tags?: ("spicy" | "veg" | "popular")[];
}

export const menuItems: MenuItem[] = [
  {
    id: "double-smash",
    name: "Double Smash Burger",
    description: "Two smashed patties, American cheese, grilled onions, pickles, house sauce on a toasted sesame bun",
    price: 14.5,
    category: "burgers",
    image: "/images/gallery/classic-burger-2026.jpg",
    tags: ["popular"],
  },
  {
    id: "spicy-crispy",
    name: "Spicy Crispy Chicken",
    description: "Buttermilk-brined crispy chicken, spicy slaw, pickles, chipotle mayo on a brioche bun",
    price: 13.5,
    category: "burgers",
    image: "/images/gallery/crispy-chicken-burger.jpg",
    tags: ["spicy"],
  },
  {
    id: "veggie-stack",
    name: "Veggie Stack",
    description: "Grilled portobello, roasted red pepper, arugula, goat cheese, basil aioli on a whole wheat bun",
    price: 12.5,
    category: "burgers",
    image: "/images/gallery/classic-burger-2026.jpg",
    tags: ["veg"],
  },
  {
    id: "bacon-cheddar",
    name: "Bacon Cheddar Smash",
    description: "Smashed patty, aged cheddar, thick-cut bacon, caramelized onions, smoky BBQ sauce",
    price: 15.5,
    category: "burgers",
    image: "/images/gallery/classic-burger-2026.jpg",
    tags: ["popular"],
  },
  {
    id: "crinkle-fries",
    name: "Crinkle-Cut Fries",
    description: "Golden crinkle-cut fries with sea salt, served with house ketchup",
    price: 4.5,
    category: "sides",
    image: "/images/gallery/fries.jpg",
    tags: ["veg"],
  },
  {
    id: "onion-rings",
    name: "Beer-Battered Onion Rings",
    description: "Thick-cut onions in crisp beer batter, served with ranch",
    price: 5.5,
    category: "sides",
    image: "/images/gallery/fries.jpg",
    tags: ["veg"],
  },
  {
    id: "cheese-curds",
    name: "Fried Cheese Curds",
    description: "Wisconsin white cheddar curds, lightly breaded, served with marinara",
    price: 6.5,
    category: "sides",
    image: "/images/gallery/fries.jpg",
    tags: ["veg", "popular"],
  },
  {
    id: "chocolate-shake",
    name: "Chocolate Malt Shake",
    description: "Rich chocolate ice cream, malt powder, whipped cream, cherry",
    price: 6.5,
    category: "drinks",
    image: "/images/gallery/chocolate-malt.jpg",
    tags: ["veg"],
  },
  {
    id: "vanilla-shake",
    name: "Vanilla Bean Shake",
    description: "Madagascar vanilla ice cream, whole milk, whipped cream",
    price: 6.0,
    category: "drinks",
    image: "/images/gallery/chocolate-malt.jpg",
    tags: ["veg"],
  },
  {
    id: "cold-brew",
    name: "Nitro Cold Brew",
    description: "Steeped 18 hours, served on tap, creamy cascade",
    price: 4.5,
    category: "drinks",
    image: "/images/gallery/chocolate-malt.jpg",
    tags: ["veg"],
  },
  {
    id: "combo-classic",
    name: "Classic Combo",
    description: "Double Smash Burger, crinkle fries, fountain drink",
    price: 18.5,
    category: "combos",
    image: "/images/gallery/classic-burger-2026.jpg",
    tags: ["popular"],
  },
  {
    id: "combo-spicy",
    name: "Spicy Combo",
    description: "Spicy Crispy Chicken, onion rings, chocolate shake",
    price: 22.0,
    category: "combos",
    image: "/images/gallery/crispy-chicken-burger.jpg",
    tags: ["spicy"],
  },
];

export const categories = [
  { id: "burgers", label: "Burgers" },
  { id: "sides", label: "Sides" },
  { id: "drinks", label: "Drinks" },
  { id: "combos", label: "Combos" },
] as const;

export function getItemsByCategory(category: MenuItem["category"]) {
  return menuItems.filter((item) => item.category === category);
}

export function getSignaturePicks() {
  return menuItems.filter((item) => item.tags?.includes("popular")).slice(0, 4);
}
