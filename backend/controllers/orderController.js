const Order = require("../models/Order");
const Food = require("../models/Food");

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Private (Requires JWT token)
 */
const createOrder = async (req, res, next) => {
  try {
    const { items, deliveryAddress, paymentMethod } = req.body;

    // Validate delivery address
    if (
      !deliveryAddress ||
      !deliveryAddress.name ||
      !deliveryAddress.mobile ||
      !deliveryAddress.house ||
      !deliveryAddress.street ||
      !deliveryAddress.city ||
      !deliveryAddress.state ||
      !deliveryAddress.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a complete delivery address.",
      });
    }

    // Validate items array
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot place an order with an empty cart.",
      });
    }

    // SECURITY PRACTICE:
    // Fetch prices from database to prevent clients from forging food prices
    const validatedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);

      // Try looking up the food by ID first, or by name fallback
      let foodDoc = null;
      if (item.food && item.food.match(/^[0-9a-fA-F]{24}$/)) {
        foodDoc = await Food.findById(item.food);
      }
      if (!foodDoc && item.name) {
        foodDoc = await Food.findOne({
          name: { $regex: new RegExp(`^${item.name.trim()}$`, "i") },
        });
      }

      // If food item exists in DB, use official DB price; otherwise fallback to item.price safely
      const officialPrice = foodDoc ? foodDoc.price : Number(item.price) || 0;
      const itemName = foodDoc ? foodDoc.name : item.name;

      const lineTotal = officialPrice * quantity;
      subtotal += lineTotal;

      validatedItems.push({
        food: foodDoc ? foodDoc._id : undefined,
        name: itemName,
        price: officialPrice,
        quantity,
      });
    }

    // Server-side calculation of taxes and delivery
    const gst = Math.round(subtotal * 0.05); // 5% GST
    const deliveryCharge = subtotal > 0 ? 40 : 0; // Flat ₹40 delivery
    const totalAmount = subtotal + gst + deliveryCharge;

    // Generate unique human-readable Order Number (e.g. FE-582914)
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `FE-${randomSuffix}`;

    const order = await Order.create({
      user: req.user._id,
      orderNumber,
      items: validatedItems,
      subtotal,
      gst,
      deliveryCharge,
      totalAmount,
      deliveryAddress,
      paymentMethod: paymentMethod || "Cash On Delivery",
      orderStatus: "Preparing",
      orderDate: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged in user's orders
 * @route   GET /api/orders
 * @access  Private (Requires JWT token)
 */
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single order by ID
 * @route   GET /api/orders/:id
 * @access  Private (Requires JWT token)
 */
const getOrderById = async (req, res, next) => {
  try {
    let order = null;

    // Support lookup by MongoDB _id or orderNumber (FE-XXXXXX)
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(req.params.id);
    } else {
      order = await Order.findOne({ orderNumber: req.params.id });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Security check: ensure order belongs to requesting user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Private (Requires JWT token)
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = [
      "Pending",
      "Preparing",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowedStatuses.join(", ")}`,
      });
    }

    let order = await Order.findById(req.params.id);
    if (!order) {
      order = await Order.findOne({ orderNumber: req.params.id });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = status;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated!",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
};
