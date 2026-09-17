// ==========================================
// CHECKOUT PAGE - FoodExpress
// Connects to Express + MongoDB Atlas Orders API
// ==========================================

// Fallback API_BASE_URL if config.js is not loaded
const baseUrl = typeof window.API_BASE_URL !== "undefined"
  ? window.API_BASE_URL
  : "https://onrender.com";


const token = localStorage.getItem("token");
const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

// Require login
if (!token || !isLoggedIn) {
  alert("Please log in to proceed with checkout.");
  window.location.href = "login.html?redirect=checkout.html";
}

// 1. Display Saved Delivery Address
const addressBox = document.getElementById("show-address");
const address = JSON.parse(localStorage.getItem("address"));

if (addressBox) {
  if (address) {
    addressBox.innerHTML = `
      <strong>${address.name}</strong><br>
      ${address.house}, ${address.street}<br>
      ${address.city}, ${address.state} - ${address.pincode}<br>
      📞 ${address.mobile}
    `;
  } else {
    addressBox.innerHTML = `
      <span style="color: #dc3545;">No delivery address found!</span><br>
      <a href="address.html" style="color: #ff6b00;">Click here to enter delivery address</a>
    `;
  }
}

// 2. Display Order Summary Items
const checkoutItems = document.getElementById("checkout-items");
const cart = JSON.parse(localStorage.getItem("cart")) || [];

if (checkoutItems) {
  if (cart.length === 0) {
    checkoutItems.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    let subtotal = 0;
    checkoutItems.innerHTML = "";

    cart.forEach((item) => {
      subtotal += item.price * item.quantity;

      checkoutItems.innerHTML += `
        <div class="checkout-item" style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
          <p style="margin: 0;">${item.name} × ${item.quantity}</p>
          <span style="font-weight: 600;">₹${item.price * item.quantity}</span>
        </div>
      `;
    });

    const gst = Math.round(subtotal * 0.05);
    const delivery = subtotal > 0 ? 40 : 0;
    const total = subtotal + gst + delivery;

    document.getElementById("checkout-subtotal").innerHTML = "₹" + subtotal;
    document.getElementById("checkout-gst").innerHTML = "₹" + gst;
    document.getElementById("checkout-total").innerHTML = "₹" + total;
  }
}

// 3. Place Order Handler
const placeOrderBtn = document.getElementById("placeOrder");
const checkoutError = document.getElementById("checkout-error");

if (placeOrderBtn) {
  placeOrderBtn.addEventListener("click", async function () {
    // Check cart
    if (!cart || cart.length === 0) {
      alert("Your cart is empty! Please add items before placing an order.");
      window.location.href = "menu.html";
      return;
    }

    // Check address
    if (!address) {
      alert("Please enter a delivery address first.");
      window.location.href = "address.html";
      return;
    }

    // Selected payment method
    const selectedPayment =
      document.querySelector('input[name="payment"]:checked')?.value ||
      "Cash On Delivery";

    // Update button UI
    placeOrderBtn.disabled = true;
    placeOrderBtn.textContent = "Placing Order... ⏳";
    if (checkoutError) checkoutError.style.display = "none";

    try {
      const response = await fetch(`${baseUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart,
          deliveryAddress: address,
          paymentMethod: selectedPayment,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Clear cart from local storage
        localStorage.removeItem("cart");

        // Save last placed order details for reference
        localStorage.setItem("lastOrder", JSON.stringify(result.data));

        // Redirect to success page with real order number
        const orderId = result.data.orderNumber || result.data._id;
        window.location.href = `success.html?orderId=${encodeURIComponent(orderId)}`;
      } else {
        throw new Error(result.message || "Failed to place order.");
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      if (checkoutError) {
        checkoutError.textContent = `❌ ${error.message}`;
        checkoutError.style.display = "block";
      } else {
        alert(`❌ Order Error: ${error.message}`);
      }
      placeOrderBtn.disabled = false;
      placeOrderBtn.textContent = "Place Order";
    }
  });
}
