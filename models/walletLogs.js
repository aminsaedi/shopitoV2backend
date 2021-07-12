const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utilities/database");

const Store = require("./stores");
const Customer = require("./customers");

class WalletLog extends Model {}

WalletLog.init(
  {
    actionType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    recivedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  { sequelize }
);

WalletLog.belongsTo(Store, { foreignKey: { name: "storeId" } });
WalletLog.belongsTo(Customer, { foreignKey: { name: "customerId" } });

module.exports = WalletLog;
