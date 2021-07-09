const { Model, DataTypes } = require("sequelize");

const { sequelize } = require("../utilities/database");

const Store = require("./stores");
const Customer = require("./customers");

class Cart extends Model {}

Cart.init({}, { sequelize });

Cart.belongsTo(Store, { foreignKey: { name: "storeId" } });
Cart.belongsTo(Customer, { foreignKey: { name: "customerId" } });

module.exports = Cart;
