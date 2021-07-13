const express = require("express");

const {
  createStore,
  getStores,
  sendOtpOnAdminMobile,
} = require("../controllers/stores");

const router = express.Router();

/**
 * require {name,barcode,address,latitude,longitude}
 */
router.post("/", createStore);

router.post("/otp", sendOtpOnAdminMobile);

router.get("/", getStores);

module.exports = router;
