const { utilFindProductByBarcode } = require("./products");
const { utilFindStoreByBarcode, utilFindStoreById } = require("./stores");
const { utilFindCustomerById } = require("./customers");
const Cart = require("../models/carts");
const cartItem = require("../models/cartItems");
const errors = require("../utilities/errors");
const InStoreCustomers = require("../models/inStoreCustomers");
const messages = require("../utilities/messages");
const Product = require("../models/products");
const CartItem = require("../models/cartItems");
const WalletLog = require("../models/walletLogs");
const enums = require("../utilities/enums");

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
      await cartItem.findAndCountAll({
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
  if (!findedCart)
    return res.status(404).send({ message: errors.cartNotFound });
  const { rows, count } = await cartItem.findAndCountAll({
    where: { cartId: findedCart.id },
    include: [Product],
    raw: true,
  });
  // where: { cartId: findedCart.id },
  findedCart.items = rows;
  let totalPrice = 0;
  rows.forEach((productItem) => {
    if (
      productItem["Product.hasDiscount"] &&
      productItem["Product.discountPrice"]
    ) {
      totalPrice += productItem["Product.discountPrice"] * productItem.quantity;
    } else totalPrice += productItem["Product.price"] * productItem.quantity;
  });
  findedCart.totalPrice = totalPrice;
  return res.status(200).set("totalItems", count).send(findedCart);
};

const sendPaymentMethods = async (req, res) => {
  // TODO: check store's available payment methods ans send them to user
  // generally we have to types of methods : 1-online (both band and wallet) 2- offline (creadit card os chash on the cash)
  if (!req.params.id)
    return res.status(400).send({ messages: errors.enterCartId });
  const findedCart = await Cart.findByPk(req.params.id);
  if (!findedCart)
    return res.status(404).send({ messages: errors.cartNotFound });
  const findedStore = await utilFindStoreById(findedCart.storeId);
  if (!findedStore)
    return res.status(404).send({ message: errors.storeNotFound });
  return res.status(200).send({
    allowOnlinePayment: findedStore.allowOnlinePayment,
    allowOfflinePayment: findedStore.allowOfflinePayment,
  });
};

const lockCartById = async (req, res) => {
  if (!req.body.cartId)
    return res.status(400).send({ message: errors.enterCartId });
  const cartId = req.body.cartId;
  const cart = await Cart.findByPk(cartId);
  if (!cart) return res.status(404).send({ message: errors.cartNotFound });
  cart.locked = true;
  await cart.save();
  return res.status(200).send(cart);
};

const unlockCartById = async (req, res) => {
  if (!req.body.cartId)
    return res.status(400).send({ message: errors.enterCartId });
  const cartId = req.body.cartId;
  const cart = await Cart.findByPk(cartId);
  if (!cart) return res.status(404).send({ message: errors.cartNotFound });
  cart.locked = false;
  await cart.save();
  return res.status(200).send(cart);
};

const payWithWalletAndFinishShopping = async (req, res) => {
  const customerId = req.user.customerId;
  const findedCustomer = await utilFindCustomerById(customerId);
  if (!req.body.cartId)
    return res.status(400).send({ message: errors.enterCartId });
  const findedCart = await Cart.findByPk(req.body.cartId);
  if (!findedCart)
    return res.status(404).send({ message: errors.cartNotFound });
  const cartItems = await CartItem.findAll({
    where: { cartId: findedCart.id },
    include: [Product],
    raw: true,
  });
  const findedStore = await utilFindStoreById(findedCart.storeId);
  if (!findedStore)
    return res.status(404).send({ message: errors.storeNotFound });
  let totalPrice = 0;
  cartItems.forEach((productItem) => {
    if (
      productItem["Product.hasDiscount"] &&
      productItem["Product.discountPrice"]
    ) {
      totalPrice += productItem["Product.discountPrice"] * productItem.quantity;
    } else totalPrice += productItem["Product.price"] * productItem.quantity;
  });
  if (findedCustomer.wallet >= totalPrice) {
    findedCustomer.wallet -= totalPrice;
    findedStore.wallet += totalPrice;
    await WalletLog.create({
      actionType: enums.walletActions.increment,
      amount: totalPrice,
      recivedBy: enums.walletRecivedByTypes.store,
      date: Date(),
      storeId: findedStore.id,
    });
    await WalletLog.create({
      actionType: enums.walletActions.decrement,
      amount: totalPrice,
      recivedBy: enums.walletRecivedByTypes.customer,
      date: Date(),
      customerId,
    });
    await findedStore.save();
    await findedCustomer.save();
    findedCart.status = enums.cartStatuses.finishedWithWalletPayment;
    await findedCart.save();
    return res
      .status(200)
      .send({ message: messages.shoppingFinishedAndPaiedWithWallet });
  } else if (findedCustomer.wallet < totalPrice)
    return res.status(400).send({ message: errors.walletBalanceIsLow });
  return res.status(500).send({ message: errors.faUnhandledError });

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
  sendPaymentMethods,
  lockCartById,
  unlockCartById,
  payWithWalletAndFinishShopping,
};
