// ==========================================
// FoodExpress - Frontend API Configuration
// ==========================================

/**
 * Automatically sets the API URL globally across the browser window context
 */
window.API_BASE_URL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000/api"
    : "https://fooddeliveryapp-webg.onrender.com/api";
