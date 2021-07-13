const WalletLog = require("../models/walletLogs");
const errors = require("../utilities/errors");
const { utilFindStaffById } = require("./staffs");

const getWalletHistory = async (req, res) => {
  let mode, userId, findedStaff;
  if (req.user.customerId) {
    mode = "customer";
    userId = req.user.customerId;
  } else if (req.user.staffId) {
    mode = "store";
    userId = req.user.staffId;
  }
  if (mode === "store") {
    findedStaff = await utilFindStaffById(userId);
    if (!findedStaff)
      return res.status(404).sedn({ message: errors.staffNotFound });
  }
  let limit = req.query?.limit;
  let offset = req.query?.offset;
  const { count, rows } = await WalletLog.findAndCountAll({
    ...(limit ? { limit: Number(limit) } : {}),
    ...(offset ? { offset: Number(offset) } : {}),
    where: {
      recivedBy: mode,
      ...(mode === "customer"
        ? { customerId: userId }
        : { storeId: findedStaff.storeId }),
    },
  });
  res.status(200).set("totalItems", count).send(rows);
};

const generateOnlinePaymentForChargeWallet = async (req, res) => {};

module.exports = { getWalletHistory, generateOnlinePaymentForChargeWallet };
