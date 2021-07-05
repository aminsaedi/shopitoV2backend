const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utilities/database");

class Customers extends Model {}

Customers.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otpExpireTime: {
      type: DataTypes.DATE,
      allowNull : true
    },
    wallet: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  { sequelize }
);

module.exports = Customers;
