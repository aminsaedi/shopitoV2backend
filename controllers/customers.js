const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const moment = require("moment");
const config = require("config");

const Customer = require("../models/customers");
const optGenerator = require("../utilities/optGenerator");
const errors = require("../utilities/errors");
const messages = require("../utilities/messages");
const tokenGenerator = require("../utilities/tokenGenerator");

const checkCustomerExists = async (req, res) => {
  if (!req.body.username)
    return res
      .status(400)
      .send({ message: errors.faMobileOrUsernameIsRequierd });
  const isCustomerFound = await Customer.findOne({
    where: {
      [Op.or]: [{ mobile: req.body.username }, { username: req.body.username }],
    },
  });
  // TODO: if user is exists send user fullName to client in order to say his name in welcome text
  if (isCustomerFound) return res.status(200).send(true);
  else if (!isCustomerFound) return res.status(404).send(false);
  return res.status(500).send({ message: errors.faUnhandledError });
};

const registerCustomer = async (req, res) => {
  if (!req.body.mobile)
    return res.status(400).send({ message: errors.faMobileIsrequired });
  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    const createdCustomer = await Customer.create({
      mobile: req.body.mobile,
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
    });
    const token = tokenGenerator({
      customerId: createdCustomer.id,
      mobile: createdCustomer.mobile,
    });
    return res.status(200).send(token);
  } catch (error) {
    return res.status(500).send({
      message: errors.faFailedRegisterCustomer,
      error: error.toString(),
    });
  }
};

const loginCustomer = async (req, res) => {
  if (!req.body.username)
    return res
      .status(400)
      .send({ message: errors.faMobileOrUsernameIsRequierd });
  else if (!req.body.password)
    return res.status(400).send({ message: errors.faPassWordIsRequired });
  try {
    const foundedCustomer = await Customer.findOne({
      where: {
        [Op.or]: [
          { mobile: req.body.username },
          { username: req.body.username },
        ],
      },
    });
    if (!foundedCustomer)
      return res.status(404).send({ message: errors.faCustomerNotFound });
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      foundedCustomer.password
    );
    if (!isPasswordValid)
      return res.status(400).send({ message: errors.faWrongPassword });
    const token = tokenGenerator({
      customerId: foundedCustomer.id,
      mobile: foundedCustomer.mobile,
    });
    res.status(200).send(token);
  } catch (error) {
    return res
      .status(500)
      .send({ message: errors.faUnhandledError, error: error.toString() });
  }
};

const sendOtp = async (req, res) => {
  if (!req.body.mobile)
    return res.status(400).send({ message: errors.faMobileIsrequired });
  const foundedCustomer = await Customer.findOne({
    where: { mobile: req.body.mobile },
  });
  if (foundedCustomer.otpExpireTime) {
    const lastTimeSent = moment(foundedCustomer.otpExpireTime);
    const diff = lastTimeSent.diff(moment(), "seconds");
    if (diff > 0)
      return res.status(429).send({
        message: errors.faToomanyOtpRequest(diff),
      });
  }
  if (foundedCustomer.otpExpireTime)
    if (!foundedCustomer)
      return res.status(404).send({ message: errors.faCustomerNotFound });
  const otp = optGenerator();
  foundedCustomer.otpExpireTime = new moment().add(
    config.get("otpExpireTime"),
    "seconds"
  );
  foundedCustomer.otp = otp;
  await foundedCustomer.save();
  return res.status(200).send({ message: messages.faOtpSentToCustomer });
};

const loginWithOtp = async (req, res) => {
  if (!req.body.username)
    return res.status(400).send({ message: errors.faMobileIsrequired });
  else if (!req.body.otp)
    return res.status(400).send({ message: errors.faOtpIsRequired });
  const foundedCustomer = await Customer.findOne({
    where: {
      mobile: req.body.username,
    },
  });
  if (!foundedCustomer)
    return res.status(404).send({ message: errors.faCustomerNotFound });
  if (foundedCustomer) {
    const isOtpValid =
      moment(foundedCustomer.otpExpireTime).diff(moment(), "seconds") > 0
        ? true
        : false;
    if (!isOtpValid)
      return res.status(400).send({ message: errors.faOtpIsExpired });
    if (foundedCustomer.otp === req.body.otp) {
      const token = tokenGenerator({
        customerId: foundedCustomer.id,
        mobile: foundedCustomer.mobile,
      });
      foundedCustomer.otp = null;
      await foundedCustomer.save();
      return res.status(200).send(token);
    } else if (foundedCustomer.otp !== req.body.otp) {
      return res.status(400).send({ message: errors.faWrongOtp });
    }
  }
};

module.exports = {
  checkCustomerExists,
  registerCustomer,
  loginCustomer,
  sendOtp,
  loginWithOtp,
};
