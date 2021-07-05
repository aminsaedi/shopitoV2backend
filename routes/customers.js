const express = require("express");
const { checkCustomerExists } = require("../controllers/customers");

const router = express.Router();

/**
 * require req.body.username and search over database and if user exists return true (temporary) and false on the other hand
 */
router.post("/isCustomerExists", checkCustomerExists);

module.exports = router;
