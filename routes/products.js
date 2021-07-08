const express = require("express");

const {
  addNewProduct,
  updateProductState,
  updateProductPrice,
  updateProductDiscountState,
  updateProductName,
  deleteProduct,
  getProductById,
  getAllProducts,
} = require("../controllers/products");

const router = express.Router();

router.get("/:id", getProductById);
router.get("/", getAllProducts);

router.post("/", addNewProduct);

router.patch("/isAvailable", updateProductState);

router.patch("/price", updateProductPrice);

router.patch("/discount", updateProductDiscountState);

router.patch("/name", updateProductName);

router.delete("/:id", deleteProduct);

module.exports = router;
