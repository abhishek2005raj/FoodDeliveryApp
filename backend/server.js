const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB Atlas
const connectDB = require("./config/db");
connectDB();

const app = express();

// ==========================================
// Middleware
// ==========================================

// Enable CORS for all origins (allows frontend on Live Server or direct file/localhost)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parser middlewares for parsing JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files directly from the "food delivery app" directory
const frontendPath = path.join(__dirname, "../food delivery app");
app.use(express.static(frontendPath));

// ==========================================
// API Routes
// ==========================================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/foods", require("./routes/foodRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "FoodExpress Backend API is running smoothly!",
    timestamp: new Date().toISOString(),
  });
});

// Fallback to index.html for any root route
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ==========================================
// Error Handling Middleware
// ==========================================
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
app.use(notFound);
app.use(errorHandler);

// ==========================================
// Start Server
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 FoodExpress Server is running on port ${PORT}`);
  console.log(`🌐 Local Website URL: http://localhost:${PORT}`);
  console.log(`📡 API Base URL:      http://localhost:${PORT}/api`);
  console.log(`==================================================\n`);
});
