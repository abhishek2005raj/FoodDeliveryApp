// ==========================================
// ORDERS PAGE - FoodExpress
// Fetches and displays user order history from backend
// ==========================================

// Fallback API_BASE_URL if config.js is not loaded
const baseUrl = typeof window.API_BASE_URL !== "undefined"
  ? window.API_BASE_URL
  : "https://onrender.com";


const token = localStorage.getItem("token");
const isLoggedIn = localStorage.getItem("isLoggedIn") === "true" && Boolean(token);
const ordersList = document.getElementById("orders-list");

// Helper to determine status badge CSS class
function getStatusClass(status) {
  switch ((status || "").toLowerCase()) {
    case "preparing":
      return "status-preparing";
    case "out for delivery":
      return "status-out";
    case "delivered":
      return "status-delivered";
    case "cancelled":
      return "status-cancelled";
    default:
      return "status-preparing";
  }
}

async function loadUserOrders() {
  if (!ordersList) return;

  // Check login state
  if (!isLoggedIn || !token) {
    ordersList.innerHTML = `
      <div class="empty-orders">
        <i class="fa-solid fa-lock"></i>
        <h3>Login Required</h3>
        <p>Please log in to view your order history and live delivery updates.</p>
        <button onclick="window.location.href='login.html?redirect=orders.html'" class="checkout-btn" style="max-width: 250px; margin: 0 auto;">
          Login to Continue
        </button>
      </div>
    `;
    return;
  }

  try {
    const res = await fetch(`${baseUrl}/orders`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to load orders");
    }

    const orders = data.data || [];

    if (orders.length === 0) {
      ordersList.innerHTML = `
        <div class="empty-orders">
          <i class="fa-solid fa-bag-shopping"></i>
          <h3>No Orders Placed Yet</h3>
          <p>You haven't ordered any food yet. Explore our delicious menu today!</p>
          <button onclick="window.location.href='menu.html'" class="checkout-btn" style="max-width: 250px; margin: 0 auto;">
            Explore Menu
          </button>
        </div>
      `;
      return;
    }

    ordersList.innerHTML = orders
      .map((order) => {
        const orderDate = new Date(order.orderDate || order.createdAt).toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        const statusClass = getStatusClass(order.orderStatus);

        const itemsHtml = (order.items || [])
          .map(
            (item) => `
            <div class="order-item-row">
              <span>${item.name} × ${item.quantity}</span>
              <span>₹${item.price * item.quantity}</span>
            </div>
          `
          )
          .join("");

        const addr = order.deliveryAddress || {};
        const addressText = addr.street
          ? `${addr.house}, ${addr.street}, ${addr.city}, ${addr.state} - ${addr.pincode} (📞 ${addr.mobile})`
          : "Delivery Address on File";

        return `
          <div class="order-card">
            <div class="order-card-header">
              <div>
                <span class="order-number">${order.orderNumber || order._id}</span>
                <span class="order-date" style="margin-left: 12px;">📅 ${orderDate}</span>
              </div>
              <span class="status-badge ${statusClass}">
                ● ${order.orderStatus || "Preparing"}
              </span>
            </div>

            <div class="order-items-list">
              ${itemsHtml}
              <div class="order-item-row" style="color: #888; font-size: 13px; border-top: 1px dashed #eee; margin-top: 6px; padding-top: 6px;">
                <span>GST (5%) + Delivery (₹${order.deliveryCharge || 40})</span>
                <span>₹${(order.gst || 0) + (order.deliveryCharge || 0)}</span>
              </div>
            </div>

            <div class="order-card-footer">
              <div class="order-address-summary">
                <strong>Deliver to:</strong> ${addr.name || "Customer"}<br>
                <span>${addressText}</span><br>
                <small style="color: #888;">Payment: ${order.paymentMethod || "Cash On Delivery"}</small>
              </div>

              <div style="text-align: right;">
                <span style="font-size: 13px; color: #777;">Total Paid:</span>
                <div class="order-total-amount">₹${order.totalAmount}</div>
              </div>
            </div>
          </div>
        `;
      })
      .join("");
  } catch (err) {
    console.error("Error loading orders:", err);
    ordersList.innerHTML = `
      <div class="empty-orders">
        <i class="fa-solid fa-triangle-exclamation" style="color: #dc3545;"></i>
        <h3>Unable to Load Orders</h3>
        <p>${err.message}</p>
        <button onclick="loadUserOrders()" class="checkout-btn" style="max-width: 200px; margin: 0 auto;">
          Try Again
        </button>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", loadUserOrders);
