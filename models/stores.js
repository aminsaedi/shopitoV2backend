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
    wallet: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    allowOnlinePAyment: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    allowOfflinePayment: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { sequelize }
);

Store.hasMany(Product, { foreignKey: { name: "storeId" } });

module.exports = Store;
