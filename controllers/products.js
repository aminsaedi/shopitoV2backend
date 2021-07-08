const Product = require("../models/products");
const errors = require("../utilities/errors");

const addNewProduct = async (req, res) => {
  if (
    !req.body.price ||
    !req.body.name ||
    !req.body.numberInStock ||
    !req.body.barcode ||
    !req.body.purchasePrice
  )
    return res.status(400).send({
      message:
        errors.faPriceAndNameAndNumberInStockAndBarcodeAndPurchasePriceAreRequired,
    });
  if (!req.body.storeId)
    return res.status(400).send({ message: errors.faStoreIdIsRequired });
  try {
    const createdProduct = await Product.create({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      discountPrice: req.body.discountPrice,
      hasDiscount: req.body.hasDiscount,
      numberInStock: req.body.numberInStock,
      isAvailable: req.body.isAvailable,
      StoreId: req.body.storeId,
      CategoryId: req.body.CategoryId,
      barcode: req.body.barcode,
      purchasePrice: req.body.purchasePrice,
    });
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

module.exports = {
  addNewProduct,
  updateProductState,
  updateProductPrice,
  updateProductDiscountState,
  updateProductName,
};
