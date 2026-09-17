// ==========================================
// FoodExpress - Frontend API Configuration
// ==========================================

/**
 * Automatically sets the API URL:
 * - Uses localhost if running locally via Live Server or development tools
 * - Uses the live production Render URL when deployed live
 */
const API_BASE_URL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000/api"
    : "https://onrender.com";

export default API_BASE_URL;
