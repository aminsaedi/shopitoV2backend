const Product = require("../models/products");
const ProductImage = require("../models/productImages");
const errors = require("../utilities/errors");
const messages = require("../utilities/messages");
const config = require("config");

const addNewProduct = async (req, res) => {
  if (req.file && req.file.size > config.get("maxImageSize"))
    return res.status(400).send({ message: errors.imageSizeIsTooLarge });
  if (
    !req.body.price ||
    !req.body.name ||
    !req.body.numberInStock ||
    !req.body.barcode ||
    !req.body.purchasePrice ||
    !req.body.storeId ||
    !req.body.categoryId
  )
    return res.status(400).send({
      message:
        errors.faPriceAndNameAndNumberInStockAndBarcodeAndPurchasePriceAndSoreIdAndCategoryAreRequired,
    });
  if (!req.body.storeId)
    return res.status(400).send({ message: errors.faStoreIdIsRequired });
  try {
    let createdProductImage;
    if (req.file)
      createdProductImage = await ProductImage.create({
        ...req.file,
      });
    console.log(createdProductImage);
    const createdProduct = await Product.create({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      discountPrice: req.body.discountPrice,
      hasDiscount: req.body.hasDiscount,
      numberInStock: req.body.numberInStock,
      isAvailable: req.body.isAvailable,
      storeId: req.body.storeId,
      categoryId: req.body.categoryId,
      barcode: req.body.barcode,
      purchasePrice: req.body.purchasePrice,
      ...(createdProductImage && createdProductImage.id
        ? { imageId: createdProductImage.id }
        : null),
    });
    createdProductImage &&
      createdProduct.setDataValue("imageId", createdProductImage.id);
    return res.status(200).send(createdProduct);
  } catch (error) {
    return res
      .status(500)
      .send({ message: errors.faAddNewProductFailed, error: error.toString() });
  }
};

const updateProductState = async (req, res) => {
  if (!req.body.productId)
    return res.status(400).send({ message: errors.faEnterProductId });
  if (!req.body.isAvailable || !req.body.isAvailable.toString())
    return res.status(400).send({ message: errors.faEnterProductState });

  try {
    const updatedProduct = await Product.findByPk(req.body.productId);
    if (!updatedProduct)
      return res.status(404).send({ message: errors.faProductNotFound });
    updatedProduct.isAvailable = req.body.isAvailable;
    await updatedProduct.save();
    return res.status(200).send(updatedProduct);
  } catch (error) {
    return res
      .status(500)
      .send({ message: errors.faUpdateProductFailed, error: error.toString() });
  }
};

const updateProductPrice = async (req, res) => {
  if (!req.body.productId)
    return res.status(400).send({ message: errors.faEnterProductId });
  try {
    const updatedProduct = await Product.findByPk(req.body.productId);
    if (!updatedProduct)
      return res.status(404).send({ message: errors.faProductNotFound });
    if (req.body.price) updatedProduct.price = req.body.price;
    if (req.body.purchasePrice)
      updatedProduct.purchasePrice = req.body.purchasePrice;
    await updatedProduct.save();
    return res.status(200).send(updatedProduct);
  } catch (error) {
    return res
      .status(500)
      .send({ message: errors.faUpdateProductFailed, error: error.toString() });
  }
};

const updateProductDiscountState = async (req, res) => {
  if (!req.body.productId)
    return res.status(400).send({ message: errors.faEnterProductId });
  if (!req.body.hasDiscount?.toString())
    return res.status(400).send({ message: errors.faEnterDiscountState });
  if (req.body.discountPrice && req.body.discountPrice <= 0)
    return res.status(400).send({ message: errors.faOutOfRangeDiscountPrice });
  try {
    const updatedProduct = await Product.findByPk(req.body.productId);
    if (!updatedProduct)
      return res.status(404).send({ message: errors.faProductNotFound });
    if (updatedProduct.price < req.body.discountPrice)
      return res
        .status(400)
        .send({ message: errors.faOutOfRangeDiscountPrice });
    updatedProduct.hasDiscount = req.body.hasDiscount;
    updatedProduct.discountPrice = req.body.discountPrice;
    await updatedProduct.save();
    return res.status(200).send(updatedProduct);
  } catch (error) {
    return res
      .status(500)
      .send({ message: errors.faUpdateProductFailed, error: error.toString() });
  }
};

const updateProductName = async (req, res) => {
  if (!req.body.productId)
    return res.status(400).send({ message: errors.faEnterProductId });
  if (!req.body.name)
    return res.status(400).send({
      message: [errors.faPriceAndNameAndNumberInStockAndBarcodeAreRequired[1]],
    });
  try {
    const updatedProduct = await Product.findByPk(req.body.productId);
    if (!updatedProduct)
      return res.status(404).send({ message: errors.faProductNotFound });
    updatedProduct.name = req.body.name;
    await updatedProduct.save();
    return res.status(200).send(updatedProduct);
  } catch (error) {
    return res
      .status(500)
      .send({ message: errors.faUpdateProductFailed, error: error.toString() });
  }
};

const deleteProduct = async (req, res) => {
  if (!req.params || !req.params.id)
    return res.status(400).send({ message: errors.faEnterProductId });
  try {
    await Product.destroy({ where: { id: req.params.id } });
    return res.status(200).send({ message: messages.faProductDeleted });
  } catch (error) {
    return res
      .status(500)
      .send({ message: errors.faDeleteProductFailed, error: error.toString() });
  }
};

const getProductById = async (req, res) => {
  if (!req.params || !req.params.id)
    return res.status(400).send({ message: errors.faEnterProductId });
  try {
    const findedProduct = await Product.findByPk(req.params.id, {
      include: [ProductImage],
    });
    if (!findedProduct)
      return res.status(404).send({ message: errors.faProductNotFound });
    return res.status(200).send(findedProduct);
  } catch (error) {
    return res
      .status(500)
      .send({ message: errors.faUnhandledError, error: error.toString() });
  }
};

const getAllProducts = async (req, res) => {
  const categoryId = req.query?.categoryId;
  const storeId = req.query?.storeId;
  let sort;
  if (req.query && req.query.sort && Array.isArray(req.query.sort))
    sort = req.query.sort;
  else if (req.query && req.query.sort && !Array.isArray(req.query.sort))
    sort = [req.query.sort];
  else if (!req.query || !req.query.sort) sort = ["id"];
  console.log(sort);

  try {
    const { rows, count } = await Product.findAndCountAll({
      order: [
        ...sort.map((i) => [
          i.toString()[0] === "-"
            ? i.toString().slice(1, i.toString().length)
            : i.toString(),
          i.toString()[0] === "-" ? "DESC" : "ASC",
        ]),
      ],
      where: {
        ...(categoryId ? { categoryId } : null),
        ...(storeId ? { storeId } : null),
      },
      include: [ProductImage],
    });
    return res.set("totalItems", count).status(200).send(rows);
  } catch (error) {
    return res
      .status(500)
      .send({ message: errors.faUnhandledError, error: error.toString() });
  }
};

const updateProductImage = async (req, res) => {
  if (!req.file) return res.status(400).send({ message: errors.imageNotSent });
  if (req.file.size > config.get("maxImageSize"))
    return res.status(400).send({ message: errors.imageSizeIsTooLarge });
  if (!req.body.productId)
    return res.status(400).send({ message: errors.faEnterProductId });
  const findedProduct = await Product.findByPk(req.body.productId);
  if (!findedProduct)
    return res.status(404).send({ message: errors.faProductNotFound });
  createdProductImage = await ProductImage.create({
    ...req.file,
  });
  findedProduct.imageId = createdProductImage.id;
  await findedProduct.save();
  const newProduct = await Product.findByPk(req.body.productId, {
    include: [ProductImage],
  });
  return res.status(200).send(newProduct);
};

const utilFindProductById = async (productId) => {
  const findedProduct = await Product.findByPk(productId);
  if (!findedProduct) return null;
  return findedProduct;
};

const utilFindProductByBarcode = async (barcode) => {
  const findedProduct = await Product.findOne({ where: { barcode } });
  if (!findedProduct) return null;
  return findedProduct;
};

module.exports = {
  addNewProduct,
  updateProductState,
  updateProductPrice,
  updateProductDiscountState,
  updateProductName,
  deleteProduct,
  getProductById,
  getAllProducts,
  updateProductImage,
  utilFindProductById,
  utilFindProductByBarcode,
};
