const { Op, DataTypes } = require("sequelize");
const Category = require("../models/categories");
const errors = require("../utilities/errors");
const messages = require("../utilities/messages");

const createDataTree = (items, id = null, link = "parentId") =>
  items
    .filter((item) => item[link] === id)
    .map((item) => ({ ...item, children: createDataTree(items, item.id) }));

const addNewCategory = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({ message: errors.faCategoryNameIsRequired });
  }
  try {
    const productsLength = await Category.count();
    if (productsLength === 0) {
      const createdCategory = await Category.create({
        name: req.body.name,
        description: req.body.description,
        lft: 1,
        rgt: 2,
      });
      return res.status(200).send(createdCategory);
    } else if (productsLength > 0) {
      if (!req.body.parentId)
        return res
          .status(400)
          .send({ message: errors.faEnterCategoryParentId });
      const parent = await Category.findByPk(req.body.parentId);
      if (!parent)
        return res.status(400).send({ message: errors.faRootCategoryNotFound });
      await Category.increment("rgt", {
        by: 2,
        where: {
          rgt: {
            [Op.gt]: parent.rgt - 1,
          },
        },
      });
      await Category.increment("lft", {
        by: 2,
        where: {
          lft: {
            [Op.gt]: parent.rgt - 1,
          },
        },
      });
      const createdCategory = await Category.create({
        name: req.body.name,
        description: req.body.description,
        parentId: req.body.parentId,
        lft: parent.rgt,
        rgt: parent.rgt + 1,
      });
      return res.status(200).send(createdCategory);
      // TODO: majic to add lft and rgt
    }
  } catch (error) {
    return res.status(500).send({
      message: errors.faAddNewCategoryFailed,
      error: error.toString(),
    });
  }
};

const getCategories = async (req, res) => {
  const rootId = Number(req.params?.id);
  const root = await Category.findOne({ where: { parentId: null } });
  if (!root)
    return res.status(404).send({ message: errors.faRootCategoryNotFound });
  const right = [];
  const result = await Category.findAll({
    where: {
      lft: {
        [Op.between]: [root.lft, root.rgt],
      },
    },
    order: [["lft", "asc"]],
    raw: true,
  });
  result[0].parentId = null;
  const jsonResult = createDataTree(result);
  res.status(200).send(jsonResult[0]);
};

const removeCategory = async (req, res) => {
  if (!req.params || !req.params.id)
    return res.status(400).send({ message: errors.faEnterCategoryId });
  try {
    await Category.destroy({ where: { id: req.params.id } });
    await Category.destroy({ where: { parentId: req.params.id } });
    return res.status(200).send({ message: messages.faCategoryDeleted });
  } catch (error) {
    return res.status(500).send({
      message: errors.faDeleteCategotyFailed,
      error: error.toString(),
    });
  }
};

const updateCategory = async (req, res) => {
  if (!req.params || !req.params.id)
    return res.status(400).send({ message: errors.faEnterCategoryId });
  if (!req.body || !req.body.description)
    return res.status(400).send({ message: errors.faCategoryNameIsRequired });
  const updatedCategory = await Category.findByPk(req.params.id);
  if (!updateCategory)
    return res.status(404).send({ message: errors.faCategoryNotFound });
  try {
    updatedCategory.name = req.body?.name;
    updatedCategory.description = req.body?.description;
    await updatedCategory.save();
    return res.status(200).send(updatedCategory);
  } catch (error) {
    return res.status(500).send({ message: errors.faUpdateCategoryFailed });
  }
};

module.exports = {
  addNewCategory,
  getCategories,
  removeCategory,
  updateCategory,
};
