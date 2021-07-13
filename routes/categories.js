const express = require("express");

const {
  addNewCategory,
  getCategories,
  removeCategory,
  updateCategory,
} = require("../controllers/categories");

const router = express.Router();

router.get("/", getCategories);

router.get("/:id", getCategories);

router.post("/", addNewCategory);

router.delete("/:id", removeCategory);

router.put("/:id", updateCategory);

module.exports = router;
