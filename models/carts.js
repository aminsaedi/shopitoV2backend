const { Model, DataTypes } = require("sequelize");

const { sequelize } = require("../utilities/database");

const enums = require("../utilities/enums");

const Store = require("./stores");
const Customer = require("./customers");

class Cart extends Model {}

Cart.init(
  {
    locked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    customerAllowToUnlock: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lockReason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: enums.cartStatuses.shopping,
    },
  },
  { sequelize }
);

Cart.belongsTo(Store, { foreignKey: { name: "storeId" } });
Cart.belongsTo(Customer, { foreignKey: { name: "customerId" } });

module.exports = Cart;
