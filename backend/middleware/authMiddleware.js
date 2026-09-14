const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Middleware to protect private routes using JWT.
 * Looks for 'Authorization: Bearer <token>' header.
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from header "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];

      // Verify token signature and expiration
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID encoded in token payload (exclude password)
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User account associated with this token no longer exists.",
        });
      }

      // Attach user object to request
      req.user = user;
      return next();
    } catch (error) {
      console.error("JWT Verification failed:", error.message);
      return res.status(401).json({
        success: false,
        message: "Not authorized. Invalid or expired token.",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. No authentication token provided.",
    });
  }
};

module.exports = { protect };
