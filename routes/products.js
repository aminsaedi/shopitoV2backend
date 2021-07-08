const express = require("express");

const {
  addNewProduct,
  updateProductState,
  updateProductPrice,
  updateProductDiscountState,
  updateProductName,
} = require("../controllers/products");

const router = express.Router();

router.post("/", addNewProduct);

router.patch("/isAvailable", updateProductState);

router.patch("/price", updateProductPrice);

router.patch("/discount", updateProductDiscountState);

router.patch("/name", updateProductName);

module.exports = router;
