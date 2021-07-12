const enums = {
  // 0 => Increment
  // 1 => Decrement
  // 2 => balance
  walletActions: {
    increment: "increment",
    decrement: "decrement",
    system: "system",
  },
  // 0 => wait for offline payment
  // 1 => lock by admin
  cartLockReasons: {
    waitingForOffliePayment: "در انتظار پرداخت در صندوق",
    lockedByStoreManager: "محدود شده توسط مدیر فروشگاه",
  },
  cartStatuses: {
    shopping: "shopping",
    finishedWithWalletPayment: "finishedWithWalletPayment",
    finishedWithOnlinePayment: "finishedWithOnlinePayment",
    finishedWithOfflinePayment: "finishedWithOfflinePayment",
  },
  walletRecivedByTypes: {
    store: "store",
    customer: "customer",
  },
};

module.exports = enums;
