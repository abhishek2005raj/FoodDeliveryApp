// ==========================================
// CART PAGE - FoodExpress
// Manages cart items, quantities, and bill calculation
// ==========================================

// Get Cart Data from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartContainer = document.getElementById("cart-container");

if (cartContainer) {
  displayCart();
}

// ==========================================
// Display Cart Items
// ==========================================
function displayCart() {
  cartContainer.innerHTML = "";

  let subtotal = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div style="text-align: center; padding: 40px; background: white; border-radius: 20px;">
        <h2>Your Cart is Empty 🛒</h2>
        <p style="color: #777; margin: 15px 0 25px;">Looks like you haven't added any delicious food yet!</p>
        <button onclick="window.location.href='menu.html'" style="background: #ff6b00; color: white; border: none; padding: 12px 30px; border-radius: 25px; cursor: pointer; font-size: 15px;">
          Browse Menu
        </button>
      </div>
    `;
    updateBill(0);
    return;
  }

  cart.forEach((item, index) => {
    subtotal += item.price * item.quantity;

    cartContainer.innerHTML += `
      <div class="card" style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; padding: 20px 25px;">
        <div style="text-align: left;">
          <h3 style="margin-top: 0; font-size: 20px;">${item.name}</h3>
          <p style="margin: 5px 0; font-size: 16px; color: #ff6b00; font-weight: 600;">₹${item.price}</p>
          <p style="font-size: 14px; color: #666;">Quantity: ${item.quantity}</p>
        </div>

        <div style="display: flex; gap: 10px; align-items: center;">
          <button onclick="decreaseQty(${index})" style="width: 35px; height: 35px; border-radius: 50%; border: 1px solid #ddd; background: #f8f9fa; cursor: pointer; font-size: 18px; font-weight: bold;">-</button>
          <span style="font-weight: bold; font-size: 16px; min-width: 20px; text-align: center;">${item.quantity}</span>
          <button onclick="increaseQty(${index})" style="width: 35px; height: 35px; border-radius: 50%; border: 1px solid #ddd; background: #f8f9fa; cursor: pointer; font-size: 18px; font-weight: bold;">+</button>
          <button onclick="removeItem(${index})" style="background: #dc3545; color: white; border: none; padding: 8px 15px; border-radius: 8px; cursor: pointer; font-size: 14px; margin-left: 10px;">
            Remove
          </button>
        </div>
      </div>
    `;
  });

  updateBill(subtotal);
}

// ==========================================
// Calculate & Update Bill
// ==========================================
function updateBill(subtotal) {
  const gst = subtotal > 0 ? Math.round(subtotal * 0.05) : 0;
  const delivery = subtotal > 0 ? 40 : 0;
  const total = subtotal + gst + delivery;

  const subtotalBox = document.getElementById("subtotal");
  const gstBox = document.getElementById("gst");
  const totalBox = document.getElementById("total-price");

  if (subtotalBox) subtotalBox.innerHTML = "₹" + subtotal;
  if (gstBox) gstBox.innerHTML = "₹" + gst;
  if (totalBox) totalBox.innerHTML = "₹" + total;
}

// ==========================================
// Increase Quantity
// ==========================================
function increaseQty(index) {
  cart[index].quantity++;
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// ==========================================
// Decrease Quantity
// ==========================================
function decreaseQty(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// ==========================================
// Remove Item
// ==========================================
function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// ==========================================
// Proceed to Checkout Handler
// ==========================================
const proceedBtn = document.getElementById("proceedToCheckoutBtn");

if (proceedBtn) {
  proceedBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty! Please add some delicious food first.");
      return;
    }

    const token = localStorage.getItem("token");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!token || !isLoggedIn) {
      alert("Please log in or register to complete your order.");
      window.location.href = "login.html?redirect=address.html";
      return;
    }

    window.location.href = "address.html";
  });
}