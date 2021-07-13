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
    allowOnlinePayment: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    allowOfflinePayment: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otpExpireTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  { sequelize }
);

Store.hasMany(Product, { foreignKey: { name: "storeId" } });

module.exports = Store;
