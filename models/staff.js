const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utilities/database");

const Store = require("./stores");

class Staff extends Model {}

Staff.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    accessLevel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize }
);

Staff.belongsTo(Store, { foreignKey: { name: "storeId" } });

module.exports = Staff;
