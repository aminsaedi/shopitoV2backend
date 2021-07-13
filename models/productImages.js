const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utilities/database");
const Product = require("./products");

class ProductImage extends Model {}

ProductImage.init(
  {
    fieldname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    originalname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    encoding: {
      type: DataTypes.STRING,
    },
    mimetype: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { sequelize }
);

// ProductImage.belongsTo(Product, { foreignKey: { name: "productId" } });

module.exports = ProductImage;
