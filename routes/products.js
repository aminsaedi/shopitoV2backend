const express = require("express");
const multer = require("multer");

const {
  addNewProduct,
  updateProductState,
  updateProductPrice,
  updateProductDiscountState,
  updateProductName,
  deleteProduct,
  getProductById,
  getAllProducts,
  updateProductImage,
} = require("../controllers/products");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.delete("/:id", deleteProduct);

router.get("/:id", getProductById);

router.get("/", getAllProducts);

router.patch("/discount", updateProductDiscountState);

router.patch("/image", upload.single("image"), updateProductImage);


router.patch("/isAvailable", updateProductState);

router.patch("/name", updateProductName);

router.patch("/price", updateProductPrice);

router.post("/", upload.single("image"), addNewProduct);

module.exports = router;
