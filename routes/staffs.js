const express = require("express");

const { loginStaff, registerStaff } = require("../controllers/staffs");

const router = express.Router();

router.post("/login", loginStaff);

router.post("/register", registerStaff);

module.exports = router;
