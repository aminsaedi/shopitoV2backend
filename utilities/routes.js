const express = require("express");

const customers = require("../routes/customers");
const stores = require("../routes/stores");
const products = require("../routes/products");
const categories = require("../routes/categories");
const shopping = require("../routes/shopping");
const wallets = require("../routes/wallets");
const staffs = require("../routes/staffs");

module.exports = function (app) {
  app.use(express.static("uploads"));
  app.use(express.static("public"))
  app.use(express.json());
  app.use("/api/customers", customers);
  app.use("/api/stores", stores);
  app.use("/api/products", products);
  app.use("/api/categories", categories);
  app.use("/api/shopping", shopping);
  app.use("/api/wallets", wallets);
  app.use("/api/staffs", staffs);
};
