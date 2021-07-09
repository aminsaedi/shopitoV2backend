const { utilFindProductByBarcode } = require("./products");
const { utilFindStoreByBarcode } = require("./stores");
const Cart = require("../models/carts");
const cartItem = require("../models/cartItems");
const errors = require("../utilities/errors");
const InStoreCustomers = require("../models/inStoreCustomers");
const messages = require("../utilities/messages");
const Product = require("../models/products");

const startShopping = async (req, res) => {
  const customerId = req.user.customerId;
  const isCustomerInAnyShops = await InStoreCustomers.findOne({
    where: { customerId },
  });
  if (isCustomerInAnyShops)
    return res
      .status(400)
      .send({ message: errors.faCustomerHasActiveShopping });
  if (!req.body.storeBarcode)
    return res.status(400).send({ message: errors.faEnterStoreBarcode });
  const isStoreExists = await utilFindStoreByBarcode(req.body.storeBarcode);
  if (!isStoreExists)
    return res.status(404).send({ message: errors.faStoreNotFoundByBarcode });
  try {
    const createdInStoreCustomer = await InStoreCustomers.create({
      arraivalTime: Date(),
      customerId: req.user.customerId,
      storeId: isStoreExists.id,
    });
    const createdCart = await Cart.create(
      {
        storeId: isStoreExists.id,
        customerId: req.user.customerId,
      },
      { raw: true }
    );
    const { rows: cartItems, count: totalItems } =
      await CartItem.findAndCountAll({
        where: { cartId: createdCart.id },
        include: [Product],
      });
    createdCart.dataValues.totalItems = totalItems;
    createdCart.dataValues.items = cartItems;
    let totalAmount = 0;
    // TODO: join cartItems with Products on productId
    // cartItems.forEach(item => totalAmount+= item.product.price)
    createdCart.dataValues.totalAmount = totalAmount;
    console.log(createdCart);
    return res.status(200).send(createdCart);
  } catch (error) {
    return res
      .status(500)
      .send({ message: errors.faStartShoppingFailed, error: error.toString() });
  }
};

const addProductToCart = async (req, res) => {
  const customerId = req.user.customerId;
  const isCustomerInAnyShops = await InStoreCustomers.findOne({
    where: { customerId },
  });
  if (!isCustomerInAnyShops)
    return res
      .status(400)
      .send({ message: errors.customerDoesntHaveActiveShopping });
  if (!req.body.cartId)
    return res.status(400).send({ message: errors.enterCartId });
  const hasCart = await Cart.findByPk(req.body.cartId);
  if (!hasCart) return res.status(404).send({ message: errors.cartNotFound });
  if (!req.body.productBarcode)
    return res.status(400).send({ message: errors.enterProductBarcode });
  const isProductExists = await utilFindProductByBarcode(
    req.body.productBarcode
  );
  if (!isProductExists)
    return res.status(404).send({ message: errors.faProductNotFound });
  if (req.body.quantity < 1)
    return res
      .status(400)
      .send({ message: errors.quantityMustBeGraterThanZero });
  const alereadyExists = await cartItem.findOne({
    where: {
      cartId: req.body.cartId,
      productId: isProductExists.id || req.body.productId,
    },
  });
  if (!alereadyExists) {
    try {
      const createdCartItem = await cartItem.create({
        quantity: req.body.quantity || 1,
        productId: isProductExists.id || req.body.productId,
        cartId: req.body.cartId,
      });
      return res.status(200).send(createdCartItem);
    } catch (error) {
      return res.status(500).send({ message: errors.addItemToCartFailed });
    }
  } else if (alereadyExists) {
    try {
      await cartItem.increment("quantity", {
        by: req.body.quantity || 1,
        where: {
          productId: isProductExists.id || req.body.productId,
          cartId: req.body.cartId,
        },
      });
      const updatedCartItem = await cartItem.findOne({
        where: {
          productId: isProductExists.id || req.body.productId,
          cartId: req.body.cartId,
        },
      });
      return res.status(200).send(updatedCartItem);
    } catch (error) {
      return res
        .status(500)
        .send({ message: errors.addItemToCartFailed, error: error.toString() });
    }
  }
};

const reduceItemQuantityInCart = async (req, res) => {
  const customerId = req.user.customerId;
  const isCustomerInAnyShops = await InStoreCustomers.findOne({
    where: { customerId },
  });
  if (!isCustomerInAnyShops)
    return res
      .status(400)
      .send({ message: errors.customerDoesntHaveActiveShopping });
  if (!req.body.cartId)
    return res.status(400).send({ message: errors.enterCartId });
  const hasCart = await Cart.findByPk(req.body.cartId);
  if (!hasCart) return res.status(404).send({ message: errors.cartNotFound });
  if (!req.body.productBarcode)
    return res.status(400).send({ message: errors.enterProductBarcode });
  const isProductExists = await utilFindProductByBarcode(
    req.body.productBarcode
  );
  if (!isProductExists)
    return res.status(404).send({ message: errors.faProductNotFound });
  if (req.body.quantity < 1)
    return res
      .status(400)
      .send({ message: errors.quantityMustBeGraterThanZero });
  const alereadyExists = await cartItem.findOne({
    where: {
      cartId: req.body.cartId,
      productId: isProductExists.id,
    },
  });
  if (!alereadyExists) {
    return res.status(404).send({ message: errors.couldNotFoundItemInCart });
  } else if (alereadyExists) {
    if (
      alereadyExists.quantity <= 1 ||
      alereadyExists.quantity - req.body.quantity < 1
    )
      return res.status(400).send({
        message: errors.inOrderToDecrementQuantityShouldBeGreaterThanTwo,
      });
    try {
      await cartItem.increment("quantity", {
        by: -req.body.quantity || -1,
        where: {
          productId: isProductExists.id,
          cartId: req.body.cartId,
        },
      });
      const updatedCartItem = await cartItem.findOne({
        where: {
          productId: isProductExists.id,
          cartId: req.body.cartId,
        },
      });
      return res.status(200).send(updatedCartItem);
    } catch (error) {
      return res
        .status(500)
        .send({ message: errors.reduceQuantityFaild, error: error.toString() });
    }
  }
};

const deleteItemFromCart = async (req, res) => {
  const customerId = req.user.customerId;
  const isCustomerInAnyShops = await InStoreCustomers.findOne({
    where: { customerId },
  });
  if (!isCustomerInAnyShops)
    return res
      .status(400)
      .send({ message: errors.customerDoesntHaveActiveShopping });
  // FIXME: check if cartItemId exists in the reqquest skip validations and directly remove item
  // if (req.body.cartItemId) {
  //   try {
  //     await cartItem.destroy({ where: { id: req.body.cartItemId } });
  //     return res.status(200).send({ message: messages.itemDeletedFromCart });
  //   } catch (error) {
  //     return res.status(500).send({
  //       message: errors.deleteItemFromCartFailed,
  //       error: error.toString(),
  //     });
  //   }
  // }
  if (!req.body.cartId)
    return res.status(400).send({ message: errors.enterCartId });
  const hasCart = await Cart.findByPk(req.body.cartId);
  if (!hasCart) return res.status(404).send({ message: errors.cartNotFound });
  if (!req.body.productBarcode)
    return res.status(400).send({ message: errors.enterProductBarcode });
  const isProductExists = await utilFindProductByBarcode(
    req.body.productBarcode
  );
  if (!isProductExists)
    return res.status(404).send({ message: errors.faProductNotFound });
  if (req.body.quantity < 1)
    return res
      .status(400)
      .send({ message: errors.quantityMustBeGraterThanZero });
  const alereadyExists = await cartItem.findOne({
    where: {
      cartId: req.body.cartId,
      productId: isProductExists.id,
    },
  });
  if (!alereadyExists) {
    return res.status(404).send({ message: errors.couldNotFoundItemInCart });
  } else if (alereadyExists) {
    try {
      await cartItem.destroy({
        where: {
          cartId: req.body.cartId,
          productId: isProductExists.id,
        },
      });
      return res.status(200).send({ message: messages.itemDeletedFromCart });
    } catch (error) {
      return res.status(500).send({
        message: errors.deleteItemFromCartFailed,
        error: error.toString(),
      });
    }
  }
};

const getCart = async (req, res) => {
  const customerId = req.user.customerId;
  const findedCart = await Cart.findOne({
    where: { customerId },
    raw: true,
  });
  const {rows,count} = await cartItem.findAndCountAll()
    // where: { cartId: findedCart.id },
  findedCart.items = rows;

  return res.status(200).set("totalItems", count).send(findedCart);
};

const sendPaymentMethods = async (req, res) => {
  // TODO: check store's available payment methods ans send them to user
  // generally we have to types of methods : 1-online (both band and wallet) 2- offline (creadit card os chash on the cash)
};

const payOnChashAndFinishShopping = async (req, res) => {
  // TODO: add cartId and customerId to waitForOffilinePayment table and show that table on ther sotre mangment site
};

const payWithWalletAndFinishShopping = async (req, res) => {
  // TODO: minus total amount of cart from user wallet and add to store wallet, log event on walletLog table and add customerId and
  // cartId to the finishedShoppings table, also send a toast to the store mangment website
};

const requestOnlinePayment = async (req, res) => {
  // TODO: genrate online payment link and send it to user
};

const onlinePaymnetCallBack = async (req, res) => {
  // TODO: chech everything is needed with bank and if its ok finishCustomerPayment and add amount to customer wallet
  // log everything to tables and also add cartId and customerId to finishedOnlinePayments
};

module.exports = {
  startShopping,
  sendPaymentMethods,
  addProductToCart,
  reduceItemQuantityInCart,
  deleteItemFromCart,
  getCart,
};
