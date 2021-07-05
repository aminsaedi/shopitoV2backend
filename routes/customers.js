const express = require("express");
const {
  checkCustomerExists,
  registerCustomer,
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

module.exports = router;
