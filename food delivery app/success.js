// ==========================================
// SUCCESS PAGE - FoodExpress
// Displays confirmed order details from backend
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  const orderIdEl = document.getElementById("order-id");
  const orderDateEl = document.getElementById("order-date");
  const orderTimeEl = document.getElementById("order-time");
  const deliveryTimeEl = document.getElementById("delivery-time");
  const continueBtn = document.getElementById("continueShopping");
  const viewOrdersBtn = document.getElementById("viewOrdersBtn");

  // 1. Get Order ID from URL parameter or lastOrder in localStorage
  const urlParams = new URLSearchParams(window.location.search);
  let orderNumber = urlParams.get("orderId");

  if (!orderNumber) {
    try {
      const lastOrder = JSON.parse(localStorage.getItem("lastOrder"));
      if (lastOrder && (lastOrder.orderNumber || lastOrder._id)) {
        orderNumber = lastOrder.orderNumber || lastOrder._id;
      }
    } catch (e) {
      // Ignore
    }
  }

  if (orderIdEl) {
    orderIdEl.textContent = orderNumber || "FE-" + Math.floor(100000 + Math.random() * 900000);
  }

  // 2. Set Date & Time
  const now = new Date();
  if (orderDateEl) {
    orderDateEl.textContent = now.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  if (orderTimeEl) {
    orderTimeEl.textContent = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (deliveryTimeEl) {
    deliveryTimeEl.textContent = "30 - 40 Minutes";
  }

  // 3. Navigation Buttons
  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      window.location.href = "menu.html";
    });
  }

  if (viewOrdersBtn) {
    viewOrdersBtn.addEventListener("click", () => {
      window.location.href = "orders.html";
    });
  }
});