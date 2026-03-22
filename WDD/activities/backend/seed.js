import Product from "./models/Product.js";

// Sample dice products - now with 9 different sets!
const sampleProducts = [
  {
    name: "Crimson D6 Set",
    description: "Classic red translucent dice with white numbers. Perfect for beginners.",
    price: 5.99,
    image: "https://placehold.co/300x300/red/white?text=Crimson+D6",
    countInStock: 20,
  },
  {
    name: "Emerald Polyhedral Set",
    description: "7-piece green dice set with gold numbers. Includes D4, D6, D8, D10, D12, and D20.",
    price: 14.99,
    image: "https://placehold.co/300x300/006400/FFD700?text=Emerald+Set",
    countInStock: 12,
  },
  {
    name: "Obsidian Metal Dice",
    description: "Premium black metal dice with silver numbering. Heavyweight feel for experienced players.",
    price: 24.99,
    image: "https://placehold.co/300x300/1a1a1a/silver?text=Obsidian+Metal",
    countInStock: 8,
  },
  {
    name: "Sapphire Blue Dice Set",
    description: "Beautiful deep blue translucent dice with white numbers. A collector's favorite!",
    price: 9.99,
    image: "https://placehold.co/300x300/1e40af/white?text=Sapphire+Blue",
    countInStock: 15,
  },
  {
    name: "Golden Dragon Collection",
    description: "Luxurious gold dice with black numbers. Perfect for high-rolling sessions!",
    price: 19.99,
    image: "https://placehold.co/300x300/c9a227/black?text=Golden+Dragon",
    countInStock: 10,
  },
  {
    name: "Shadow Purple Dice",
    description: "Mysterious purple dice with silver numbers. Great for dark fantasy campaigns.",
    price: 12.99,
    image: "https://placehold.co/300x300/581c87/white?text=Shadow+Purple",
    countInStock: 18,
  },
  {
    name: "Frost Giant Dice",
    description: "Ice-blue frosted dice with dark blue numbers. Excellent for frost-themed characters.",
    price: 8.99,
    image: "https://placehold.co/300x300/a5f3fc/1e3a8a?text=Frost+Giant",
    countInStock: 25,
  },
  {
    name: "Ruby Fire Dice Set",
    description: "Glowing red-orange dice that shimmer in light. Perfect for fire mages!",
    price: 16.99,
    image: "https://placehold.co/300x300/dc2626/white?text=Ruby+Fire",
    countInStock: 7,
  },
  {
    name: "Steampunk Brass Dice",
    description: "Bronze-colored dice with intricate gears. A must-have for steampunk enthusiasts!",
    price: 21.99,
    image: "https://placehold.co/300x300/92400e/white?text=Steampunk+Brass",
    countInStock: 5,
  },
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // ALWAYS delete all products and re-add them
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    console.log("Products reset! Added 9 new dice sets.");
  } catch (error) {
    console.error("Error seeding database:", error.message);
  }
};

export default seedDatabase;
