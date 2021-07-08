const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utilities/database");

const Product = require("./products");

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
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    adminMobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize }
);

Store.hasMany(Product);

module.exports = Store;
