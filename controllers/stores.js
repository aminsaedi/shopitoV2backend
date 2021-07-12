const Store = require("../models/stores");
const errors = require("../utilities/errors");

const createStore = async (req, res) => {
  if (
    !req.body.name ||
    !req.body.barcode ||
    !req.body.address ||
    !req.body.latitude ||
    !req.body.longitude ||
    !req.body.adminMobile
  )
    return res
      .status(400)
      .send({ message: errors.faIncompeleteFieldsForCreateNewStore });
  try {
    const createdStore = await Store.create({
      name: req.body.name,
      barcode: req.body.barcode,
      address: req.body.address,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      adminMobile: req.body.adminMobile,
    });
    return res.status(200).send(createdStore);
  } catch (error) {
    return res.status(500).send({
      message: errors.faErrorWhileCreatingStore,
      error: error.toString(),
    });
  }
};

const getStores = async (req, res) => {
  let limit = req.query?.limit;
  let offset = req.query?.offset;
  console.log(limit, offset);
  const { count, rows } = await Store.findAndCountAll({
    ...(limit ? { limit: Number(limit) } : {}),
    ...(offset ? { offset: Number(offset) } : {}),
  });
  res.status(200).set("totalItems", count).send(rows);
};

const utilFindStoreByBarcode = async (barcode) => {
  const findedStore = await Store.findOne({ where: { barcode } });
  if (!findedStore) return null;
  return findedStore;
};

const utilFindStoreById = async (storeId) => {
  const findedStore = await Store.findByPk(storeId);
  if (!findedStore) return null;
  return findedStore;
};

module.exports = {
  createStore,
  getStores,
  utilFindStoreByBarcode,
  utilFindStoreById,
};
