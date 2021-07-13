const { sequelize } = require("../models/staff");
const Staff = require("../models/staff");
const bcrypt = require("bcrypt");
const { utilFindStoreByAdminMobileNumber } = require("./stores");
const enums = require("../utilities/enums");
const moment = require("moment");
const tokenGenerator = require("../utilities/tokenGenerator");

const errors = require("../utilities/errors");

const loginStaff = async (req, res) => {
  if (!req.body.username || !req.body.password)
    return res
      .status(400)
      .send({ message: errors.usernameAndPasswordIsRequired });
  try {
    const findedStaff = await Staff.findOne({
      where: { username: req.body.username },
    });
    if (!findedStaff)
      return res
        .status(404)
        .send({ message: errors.usernameAndOrPasswordIsWrong });
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      findedStaff.password
    );
    if (!isPasswordValid)
      return res.status(400).send({ message: errors.faWrongPassword });
    const token = tokenGenerator({
      staffId: findedStaff.id,
      name: findedStaff.fullName || findedStaff.username,
    });
    res.status(200).send(token);
  } catch (error) {
    return res
      .status(500)
      .send({ message: errors.faUnhandledError, error: error.toString() });
  }
};

const registerStaff = async (req, res) => {
  if (!req.body.adminMobile)
    return res.status(400).send({ message: errors.enterAdminMobileNumber });
  if (!req.body.adminOtp)
    return res.status(400).send({ message: errors.enterOtpOnStoreAdminMobile });
  if (!req.body.password || !req.body.username)
    return res
      .status(400)
      .send({ message: errors.usernameAndPasswordIsRequired });
  if (!req.body.accessLevel)
    return res.status(400).send({ message: errors.enterAccessLevel });
  const findedAccessLevel = enums.staffAccessLevels.find(
    (i) => i === req.body.accessLevel
  );
  if (!findedAccessLevel)
    return res.status(404).send({ message: errors.invalidAccessLevel });
  const findedStore = await utilFindStoreByAdminMobileNumber(
    req.body.adminMobile
  );
  if (!findedStore)
    return res.status(404).send({ message: errors.storeNotFound });
  const isOtpValid =
    moment(findedStore.otpExpireTime).diff(moment(), "seconds") > 0
      ? true
      : false;
  if (!isOtpValid)
    return res.status(400).send({ message: errors.faOtpIsExpired });
  if (findedStore.otp !== req.body.adminOtp)
    return res.status(400).send({ message: errors.faWrongOtp });
  const salt = await bcrypt.genSalt();
  req.body.password = await bcrypt.hash(req.body.password, salt);
  try {
    const createdStaff = await Staff.create({
      username: req.body.username,
      password: req.body.password,
      fullName: req.body.fullName,
      accessLevel: req.body.accessLevel,
      storeId: findedStore.id,
    });
    const token = tokenGenerator({
      staffId: findedStaff.id,
      name: findedStaff.fullName || findedStaff.username,
    });
    res.status(200).send(token);
  } catch (error) {
    return res
      .status(500)
      .send({ message: errors.createStaffFailed, error: error.toString() });
  }
};

const utilFindStaffById = async (staffId) => {
  const findedStaff = await Staff.findByPk(staffId);
  if (!findedStaff) return null;
  return findedStaff;
};

module.exports = { loginStaff, registerStaff, utilFindStaffById };
