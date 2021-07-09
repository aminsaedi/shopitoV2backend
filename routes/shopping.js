const express = require("express");
const authMiddleware = require("../middlewares/auth");
const {
  startShopping,
  addProductToCart,
  reduceItemQuantityInCart,
  deleteItemFromCart,
  getCart,
} = require("../controllers/shopping");

const router = express.Router();

router.get("/cart", authMiddleware, getCart);

router.post("/start", authMiddleware, startShopping);

router.post("/addToCart", authMiddleware, addProductToCart);

router.post("/reduceQuantity", authMiddleware, reduceItemQuantityInCart);

router.delete("/deleteItem", authMiddleware, deleteItemFromCart);

module.exports = router;
