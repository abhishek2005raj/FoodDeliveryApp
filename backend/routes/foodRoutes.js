const express = require("express");
const router = express.Router();
const {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
} = require("../controllers/foodController");

// Food menu endpoints
router.route("/").get(getFoods).post(createFood);
router.route("/:id").get(getFoodById).put(updateFood).delete(deleteFood);

module.exports = router;
