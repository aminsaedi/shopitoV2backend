const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utilities/database");

class Category extends Model {}

Category.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lft: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rgt: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { sequelize }
);

Category.hasMany(Category, { as: "children", foreignKey: "parentId" });
Category.belongsTo(Category, { as: "parent", foreignKey: "parentId" });

// Category.belongsToMany(Product);
// Category.hasMany(Product);

module.exports = Category;
