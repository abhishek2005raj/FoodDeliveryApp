// ==========================================
// MENU PAGE - FoodExpress
// Fetches dynamic food items from MongoDB Atlas Backend
// ==========================================

const baseUrl = typeof API_BASE_URL !== "undefined"
  ? API_BASE_URL
  : (window.location.port === "5000" ? "/api" : "http://localhost:5000/api");

// Get cart from Local Storage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Fallback food items in case backend is offline
const fallbackFoods = [
  { name: "Pizza", price: 299, image: "🍕", rating: 4.8 },
  { name: "Burger", price: 199, image: "🍔", rating: 4.6 },
  { name: "Chicken", price: 349, image: "🍗", rating: 4.7 },
  { name: "Noodles", price: 249, image: "🍜", rating: 4.4 },
  { name: "Biryani", price: 299, image: "🍛", rating: 4.9 },
  { name: "Cold Drink", price: 99, image: "🥤", rating: 4.3 },
  { name: "French Fries", price: 149, image: "🍟", rating: 4.5 },
  { name: "Sandwich", price: 179, image: "🥪", rating: 4.6 },
];

/**
 * Render food cards into the menu container
 */
function renderFoods(foods) {
  const container = document.getElementById("menu-container");
  if (!container) return;

  if (!foods || foods.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align:center; font-size: 18px; color: #777;">No food items available right now.</p>`;
    return;
  }

  container.innerHTML = foods
    .map(
      (food) => `
      <div class="card" data-id="${food._id || ""}">
          <h2>${food.image || "🍽️"}</h2>
          <h3>${food.name}</h3>
          <p>⭐ ${food.rating || 4.5} Rating</p>
          <p class="price">₹${food.price}</p>
          <button class="add-cart"
                  data-id="${food._id || ""}"
                  data-name="${food.name}"
                  data-price="${food.price}">
              Add to Cart
          </button>
      </div>
    `
    )
    .join("");

  attachCartListeners();
}

/**
 * Attach click handlers to all "Add to Cart" buttons
 */
function attachCartListeners() {
  const addButtons = document.querySelectorAll(".add-cart");

  addButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const foodId = this.getAttribute("data-id");
      const name = this.getAttribute("data-name");
      const price = Number(this.getAttribute("data-price"));

      // Check if item already exists in cart
      const existingItem = cart.find((item) => item.name === name);

      if (existingItem) {
        existingItem.quantity++;
        if (foodId && !existingItem.food) existingItem.food = foodId;
      } else {
        cart.push({
          food: foodId || undefined,
          name: name,
          price: price,
          quantity: 1,
        });
      }

      // Save updated cart to localStorage
      localStorage.setItem("cart", JSON.stringify(cart));

      // Update Cart Count badge
      updateCartCount();

      alert(name + " added to cart! 🛒");
    });
  });
}

/**
 * Update total item count badge in header
 */
function updateCartCount() {
  const count = document.getElementById("cart-count");
  if (count) {
    let totalItems = 0;
    cart.forEach((item) => {
      totalItems += item.quantity;
    });
    count.innerHTML = totalItems;
  }
}

/**
 * Fetch food items from backend API
 */
async function loadMenu() {
  try {
    const res = await fetch(`${baseUrl}/foods`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    const data = await res.json();
    if (data.success && Array.isArray(data.data) && data.data.length > 0) {
      renderFoods(data.data);
    } else {
      renderFoods(fallbackFoods);
    }
  } catch (err) {
    console.warn("Backend API unavailable, loading fallback foods:", err.message);
    renderFoods(fallbackFoods);
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  loadMenu();
  updateCartCount();
});