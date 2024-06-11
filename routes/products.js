var express = require("express");
var router = express.Router();
// var bcrypt = require("bcrypt");
const productModel = require("../models/product.model");
// const userModel = require("../models/user.model");
// const orderModel = require("../models/order.model");
// const jwt = require("jsonwebtoken");
// const { AuthCheck } = require("../middleware/auth");

// แสดงสินค้าทั้งหมด
router.get("/AllProducts", async function (req, res, next) {
  try {
    let productList = await productModel.find({});

    if (productList == 0) {
      return res.status(200).send({
        status: 200,
        message: "No Products",
      });
    }

    return res.status(200).send({
      status: 200,
      message: "Success",
      data: productList,
    });
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: "Unsuccess",
      detail: error.toString(),
    });
  }
});

// แสดงข้อมูล Product ตาม id ที่ใส่
router.get("/products/:id", async function (req, res, next) {
  try {
    let productList = await productModel.findById(req.params.id);

    if (productList == 0) {
      return res.status(200).send({
        status: 200,
        message: "No Products",
      });
    }

    return res.status(200).send({
      status: 200,
      message: "Success",
      data: productList,
    });
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: "Unsuccess",
      detail: error.toString(),
    });
  }
});

// เพิ่มสินค้า
router.post("/AddProducts", async function (req, res, next) {
  try {
    let { productName, type, detail, price, stock, urlImg } = req.body;

    let newProduct = await productModel({
      productName: productName,
      type: type,
      detail: detail,
      price: price,
      stock: stock,
      urlImg: urlImg,
    });

    let CreateProduct = await newProduct.save();

    return res.status(200).send({
      status: 200,
      message: "Add Product Success",
      data: CreateProduct,
    });
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: "Add Product Unsuccess !",
      detail: error.toString(),
    });
  }
});

// แก้ไขสินค้า
router.put("/EditProducts/:id", async function (req, res, next) {
  try {
    let { productName, detail, price, type, stock, urlImg } = req.body;

    let updateProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      { productName, detail, price, type, stock, urlImg },
      { new: true }
    );

    return res.status(200).send({
      status: 200,
      message: "Update Product success !",
      data: updateProduct,
    });
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: "Update Product unsuccess !",
      detail: error.toString(),
    });
  }
});

//   ลบ
router.delete("/DeleteProducts/:id", async function (req, res, next) {
  try {
    let DeleteProducts = await productModel.findByIdAndDelete(req.params.id);

    return res.status(200).send({
      status: 200,
      message: "Delete Success",
      data: DeleteProducts,
    });
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: "Delete Unsuccess",
    });
  }
});

module.exports = router;
