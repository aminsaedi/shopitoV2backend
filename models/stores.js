const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utilities/database");

class Store extends Model {}

Store.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    barcode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  { sequelize }
);

module.exports = Store;
