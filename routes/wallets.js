const express = require("express");
const authMiddleware = require("../middlewares/auth");

const { getWalletHistory } = require("../controllers/wallets");

const router = express.Router();

router.post("/history", authMiddleware, getWalletHistory);


module.exports = router