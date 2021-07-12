const express = require("express");
const authMiddleware = require("../middlewares/auth");
const {
  startShopping,
  addProductToCart,
  reduceItemQuantityInCart,
  deleteItemFromCart,
  getCart,
  sendPaymentMethods,
  lockCartById,
  unlockCartById,
  payWithWalletAndFinishShopping,
} = require("../controllers/shopping");

const router = express.Router();

router.get("/cart", authMiddleware, getCart);

router.get("/availablePaymentMethods/:id", sendPaymentMethods);

router.post("/start", authMiddleware, startShopping);

router.post("/addToCart", authMiddleware, addProductToCart);

router.post("/reduceQuantity", authMiddleware, reduceItemQuantityInCart);

router.post("/cart/lock", authMiddleware, lockCartById);

router.post("/cart/unlock", authMiddleware, unlockCartById);

router.delete("/deleteItem", authMiddleware, deleteItemFromCart);

router.post("/payWithWallet", authMiddleware, payWithWalletAndFinishShopping);

module.exports = router;
