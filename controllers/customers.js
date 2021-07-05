const { Op } = require("sequelize");

const Customers = require("../models/customers");
const generateOtp = require("../utilities/optGenerator");
const errors = require("../utilities/errors");

const checkCustomerExists = async (req, res) => {
  if (!req.body.username)
    return res
      .status(400)
      .send({ message: errors.faMobileOrUsernameIsRequierd });
  const isCustomerFound = await Customers.findOne({
    where: {
      [Op.or]: [{ mobile: req.body.username }, { username: req.body.username }],
    },
  });
  // TODO: if user is exists send user fullName to client in order to say his name in welcome text
  console.log(isCustomerFound);
  if (isCustomerFound) return res.status(200).send(true);
  else if (!isCustomerFound) return res.status(404).send(false);
  return res.status(500).send({ message: errors.faUnhandledError });
};

module.exports = { checkCustomerExists };
