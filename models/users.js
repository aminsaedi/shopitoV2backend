const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utilities/database");

class User extends Model {}

User.init(
  {
    userName: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { sequelize }
);

module.exports = User;
