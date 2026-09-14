const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, "../.env") });

const Food = require("../models/Food");

const sampleFoods = [
  {
    name: "Pizza",
    description: "Crispy thin crust loaded with rich mozzarella cheese and fresh Italian toppings.",
    price: 299,
    image: "🍕",
    category: "Pizza",
    rating: 4.8,
    availability: true,
  },
  {
    name: "Burger",
    description: "Juicy grilled patty layered with melted cheese, lettuce, tomatoes, and chef's special sauce.",
    price: 199,
    image: "🍔",
    category: "Burger",
    rating: 4.6,
    availability: true,
  },
  {
    name: "Chicken",
    description: "Tender, crispy spiced fried chicken pieces served with tangy dipping sauce.",
    price: 349,
    image: "🍗",
    category: "Chicken",
    rating: 4.7,
    availability: true,
  },
  {
    name: "Noodles",
    description: "Wok-tossed hakka noodles with fresh bell peppers, spring onions, and oriental spices.",
    price: 249,
    image: "🍜",
    category: "Noodles",
    rating: 4.4,
    availability: true,
  },
  {
    name: "Biryani",
    description: "Aromatic long-grain basmati rice cooked with fragrant royal spices and saffron.",
    price: 299,
    image: "🍛",
    category: "Biryani",
    rating: 4.9,
    availability: true,
  },
  {
    name: "Cold Drink",
    description: "Chilled and refreshing carbonated beverage to complement your favorite meals.",
    price: 99,
    image: "🥤",
    category: "Drinks",
    rating: 4.3,
    availability: true,
  },
  {
    name: "French Fries",
    description: "Crispy, golden-fried potato finger chips seasoned with sea salt and peri-peri.",
    price: 149,
    image: "🍟",
    category: "Sides",
    rating: 4.5,
    availability: true,
  },
  {
    name: "Sandwich",
    description: "Triple-layer toasted sandwich stuffed with seasoned veggies, cheese, and spicy mint chutney.",
    price: 179,
    image: "🥪",
    category: "Sandwich",
    rating: 4.6,
    availability: true,
  },
];

const seedFoods = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("❌ MONGODB_URI is not defined in backend/.env");
      process.exit(1);
    }

    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB Atlas!");

    // Check existing count or clear old sample data
    await Food.deleteMany({});
    console.log("🗑️  Cleared existing food items.");

    const inserted = await Food.insertMany(sampleFoods);
    console.log(`✨ Successfully seeded ${inserted.length} delicious food items into MongoDB Atlas!`);

    inserted.forEach((food) => {
      console.log(`   - ${food.image} ${food.name}: ₹${food.price} (${food.category})`);
    });

    console.log("\n🌱 Seeding complete! You can now run 'npm run dev'.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Error:", error.message);
    process.exit(1);
  }
};

seedFoods();
