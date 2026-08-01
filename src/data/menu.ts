import type { MenuItem, Outlet, Restaurant } from "./types";

export const DEMO_RESTAURANT: Restaurant = {
  id: "rst-uday",
  name: "Uday Foods",
  legalName: "Uday Foods & Kitchen",
  city: "Meerut",
  currency: "INR",
  timezone: "Asia/Kolkata",
};

export const DEMO_OUTLETS: Outlet[] = [
  {
    id: "out-shastri",
    restaurantId: "rst-uday",
    name: "Shastri Nagar",
    area: "Shastri Nagar, Meerut",
  },
];

function listings(zName: string, zPrice: number, sName: string, sPrice: number, base: number) {
  return [
    { channel: "zomato" as const, listingName: zName, price: zPrice },
    { channel: "swiggy" as const, listingName: sName, price: sPrice },
    { channel: "direct" as const, listingName: "Website / phone", price: base },
  ];
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "itm-biryani",
    name: "Chicken Biryani",
    category: "Biryani",
    basePrice: 249,
    foodCost: 105,
    packagingCost: 18,
    listings: listings("Chicken Dum Biryani", 279, "Special Chicken Biryani", 269, 249),
    mappingStatus: "mapped",
  },
  {
    id: "itm-butter-chicken",
    name: "Butter Chicken",
    category: "Main course",
    basePrice: 329,
    foodCost: 145,
    packagingCost: 22,
    listings: listings("Butter Chicken Full", 369, "Butter Chicken", 359, 329),
    mappingStatus: "mapped",
  },
  {
    id: "itm-paneer-tikka",
    name: "Paneer Tikka",
    category: "Starters",
    basePrice: 269,
    foodCost: 112,
    packagingCost: 18,
    listings: listings("Paneer Tikka 8 Pc", 299, "Tandoori Paneer Tikka", 289, 269),
    mappingStatus: "review",
  },
  {
    id: "itm-veg-burger",
    name: "Veg Burger",
    category: "Snacks",
    basePrice: 149,
    foodCost: 58,
    packagingCost: 12,
    listings: listings("Classic Veg Burger", 169, "Veggie Burger", 159, 149),
    mappingStatus: "mapped",
  },
  {
    id: "itm-family-combo",
    name: "Family Biryani Combo",
    category: "Combos",
    basePrice: 599,
    foodCost: 290,
    packagingCost: 35,
    listings: listings("Family Chicken Biryani", 679, "Biryani Family Pack", 649, 599),
    mappingStatus: "mapped",
  },
  {
    id: "itm-chicken-roll",
    name: "Chicken Roll",
    category: "Snacks",
    basePrice: 179,
    foodCost: 79,
    packagingCost: 10,
    listings: listings("Chicken Kathi Roll", 199, "Chicken Roll", 189, 179),
    mappingStatus: "mapped",
  },
  {
    id: "itm-veg-thali",
    name: "Veg Thali",
    category: "Thali",
    basePrice: 219,
    foodCost: 104,
    packagingCost: 20,
    listings: listings("Special Veg Thali", 249, "Veg Thali", 239, 219),
    mappingStatus: "mapped",
  },
  {
    id: "itm-cold-coffee",
    name: "Cold Coffee",
    category: "Beverages",
    basePrice: 129,
    foodCost: 44,
    packagingCost: 9,
    listings: listings("Cold Coffee Thick Shake", 149, "Cold Coffee", 139, 129),
    mappingStatus: "mapped",
  },
  {
    id: "itm-dal-makhani",
    name: "Dal Makhani",
    category: "Main course",
    basePrice: 199,
    foodCost: 72,
    packagingCost: 18,
    listings: listings("Dal Makhani Bowl", 229, "Dal Makhani", 219, 199),
    mappingStatus: "mapped",
  },
  {
    id: "itm-gulab-jamun",
    name: "Gulab Jamun (2 pc)",
    category: "Desserts",
    basePrice: 89,
    foodCost: 38,
    packagingCost: 8,
    listings: listings("Gulab Jamun 2 Pc", 99, "Gulab Jamun", 95, 89),
    mappingStatus: "review",
  },
];

export const MENU_BY_ID = new Map(MENU_ITEMS.map((item) => [item.id, item]));