const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utilities/database");

const Cart = require("./carts");
const Product = require("./products");

class CartItem extends Model {}

CartItem.init(
  {
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  { sequelize }
);

CartItem.belongsTo(Cart, { foreignKey: { name: "cartId" } });
CartItem.belongsTo(Product, { foreignKey: { name: "productId" } });

module.exports = CartItem;
