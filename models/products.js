const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utilities/database");

const Store = require("./stores");
const Category = require("./Categories");

class Product extends Model {}

Product.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    barcode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    discountPrice: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    hasDiscount: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    purchasePrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    numberInStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  { sequelize }
);

// Product.belongsTo()
Product.belongsTo(Category, { foreignKey: { name: "categoryId" } });

module.exports = Product;
