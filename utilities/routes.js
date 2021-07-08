const express = require("express");

const customers = require("../routes/customers");
const stores = require("../routes/stores");
const products = require("../routes/products");
const categories = require("../routes/categories");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/customers", customers);
  app.use("/api/stores", stores);
  app.use("/api/products", products);
  app.use("/api/categories", categories);
};
