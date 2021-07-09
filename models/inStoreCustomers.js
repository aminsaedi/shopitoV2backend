const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utilities/database");

const Customer = require("./customers");
const Store = require("./stores");

class InStoreCustomers extends Model {}

InStoreCustomers.init(
  {
    arraivalTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  { sequelize }
);

InStoreCustomers.belongsTo(Customer, { foreignKey: { name: "customerId" } });
InStoreCustomers.belongsTo(Store, { foreignKey: { name: "storeId" } });

module.exports = InStoreCustomers;
