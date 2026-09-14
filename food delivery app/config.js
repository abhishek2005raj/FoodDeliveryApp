// ==========================================
// FoodExpress - Frontend API Configuration
// ==========================================

/**
 * Automatically sets the API URL:
 * - If served directly via Express (http://localhost:5000), uses "/api"
 * - If opened via Live Server (e.g. port 5500) or other port, uses "http://localhost:5000/api"
 */
const API_BASE_URL =
  window.location.port === "5000"
    ? "/api"
    : "http://localhost:5000/api";
