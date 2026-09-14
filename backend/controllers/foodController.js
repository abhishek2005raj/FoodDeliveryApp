const Food = require("../models/Food");

/**
 * @desc    Get all food items (supports optional search and category filters)
 * @route   GET /api/foods
 * @access  Public
 */
const getFoods = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const query = { availability: true };

    // Case-insensitive search on food name
    if (search) {
      query.name = { $regex: search.trim(), $options: "i" };
    }

    // Filter by category if supplied
    if (category) {
      query.category = { $regex: category.trim(), $options: "i" };
    }

    const foods = await Food.find(query).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: foods.length,
      data: foods,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single food item by ID
 * @route   GET /api/foods/:id
 * @access  Public
 */
const getFoodById = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: `Food item not found with ID ${req.params.id}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: food,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new food item
 * @route   POST /api/foods
 * @access  Public (or protected if admin)
 */
const createFood = async (req, res, next) => {
  try {
    const { name, description, price, image, category, rating, availability } =
      req.body;

    if (!name || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, price, and category for the food item.",
      });
    }

    const food = await Food.create({
      name,
      description: description || "",
      price: Number(price),
      image: image || "🍕",
      category,
      rating: rating !== undefined ? Number(rating) : 4.5,
      availability: availability !== undefined ? availability : true,
    });

    return res.status(201).json({
      success: true,
      message: "Food item created successfully!",
      data: food,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update food item
 * @route   PUT /api/foods/:id
 * @access  Public (or admin)
 */
const updateFood = async (req, res, next) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!food) {
      return res.status(404).json({
        success: false,
        message: `Food item not found with ID ${req.params.id}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Food item updated successfully!",
      data: food,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete food item
 * @route   DELETE /api/foods/:id
 * @access  Public (or admin)
 */
const deleteFood = async (req, res, next) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: `Food item not found with ID ${req.params.id}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Food item removed successfully!",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
};
