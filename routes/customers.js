const express = require("express");
const {
  checkCustomerExists,
  registerCustomer,
  loginCustomer,
  sendOtp,
  loginWithOtp,
} = require("../controllers/customers");

const router = express.Router();

/**
 * require req.body.username and search over database and if user exists return true (temporary) and false on the other hand
 */
router.post("/isCustomerExists", checkCustomerExists);

/**
 * only mobile is reqired other fields in customers table is optional.
 * return jwt access token
 */
router.post("/register", registerCustomer);

/**
 * get {username, password} and generate token if users exists
 */
router.post("/loginWithPassword", loginCustomer);

/**
 * get {mobile} and check otpExpire time and if its valid send otp to user
 */
router.post("/sendOtp", sendOtp);

router.post("/loginWithOtp", loginWithOtp);

module.exports = router;
