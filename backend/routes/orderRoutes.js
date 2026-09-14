const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

// All order endpoints require authentication
router.use(protect);

router.route("/").post(createOrder).get(getMyOrders);
router.route("/:id").get(getOrderById);
router.route("/:id/status").put(updateOrderStatus);

module.exports = router;
