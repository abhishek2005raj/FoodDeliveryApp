const mongoose = require("mongoose");

/**
 * Connect to MongoDB Atlas using Mongoose.
 * Connection string is read securely from process.env.MONGODB_URI.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Modern mongoose defaults are optimal; additional options can be added here if needed
    });

    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`📦 Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error("\n❌ MongoDB Atlas Connection Error:", error.message);
    console.warn("⚠️  Server will continue running in offline/local mode.");
    console.warn("👉 To connect MongoDB Atlas:");
    console.warn("   1. In your Atlas modal, click 'Choose a connection method' -> 'Drivers'");
    console.warn("   2. Copy the connection string with your cluster address (e.g. cluster0.xxxx.mongodb.net)");
    console.warn("   3. Paste it into backend/.env MONGODB_URI and restart the server.\n");
  }
};

module.exports = connectDB;
