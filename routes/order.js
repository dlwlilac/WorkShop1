var express = require("express");
var router = express.Router();
// var bcrypt = require("bcrypt");
const userModel = require("../models/user.model");
const productModel = require("../models/product.model");
const orderModel = require("../models/order.model");
// const jwt = require("jsonwebtoken");
const { AuthCheck } = require("../middleware/auth");

//  แสดง Orders ทั้งหมด
router.get("/AllOrders", async function (req, res, next) {
  try {
    let OrderList = await orderModel
      .find({})
      .populate("productID", "productName")
      .populate("UserID", "firstname surname");

    if (OrderList.length == 0) {
      return res.status(400).send({
        status: 400,
        message: "Order Empty",
      });
    }

    return res.status(200).send({
      status: 200,
      message: "Order List Success",
      data: OrderList,
    });
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: "Order Error",
      detail: error.toString(),
    });
  }
});

// เพิ่มลงตะกร้า
router.post("/AddOrders", AuthCheck, async function (req, res, next) {
  try {
    let { productID, amount } = req.body;

    let products = await productModel.findById(productID);
    let users = await userModel.findById(req.auth.id);

    if (amount === 0) {
      return res.status(400).send({
        status: 400,
        message: "กรุณาระบุจำนวน 'ชิ้น' ที่ต้องการซื้อ",
      });
    }
    if (amount > products.stock) {
      return res.status(400).send({
        status: 400,
        message: `${products.productName} คงเหลือ ${products.stock} ชิ้น สินค้าไม่เพียงพอ หรือ หมด`,
      });
    } else {
      await productModel.findByIdAndUpdate(
        req.params.id,
        { stock: products.stock - amount },
        { new: true }
      );

      let price = products.price;

      let total = amount * price;

      let AddOrders = await orderModel({
        productID: productID,
        UserID: users.id,
        // username: users.username,
        // name: users.firstname,
        amount: amount,
        total: total,
      });

      await AddOrders.save();

      return res.status(200).send({
        status: 200,
        message: "สั่งซื้อสินค้าสำเร็จ !",
        data: AddOrders,
        remaining_stock: products.stock,
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: "สั่งซื้อไม่สำเร็จ !",
      detail: error.toString(),
    });
  }
});

//  แสดงรายการ Order ของ Products
router.get("/ordersProducts", AuthCheck, async function (req, res, next) {
  try {
    let { productID } = req.body;

    let order_list = await orderModel
      .find({ productID: productID })
      .populate("productID", "productName")
      .populate("UserID", "firstname surname");

    if (order_list.length == 0) {
      return res.status(400).send({
        status: 400,
        message: "Orders ว่าง",
      });
    }

    return res.status(200).send({
      status: 200,
      message: "แสดง Orders สำเร็จ",
      data: order_list,
    });
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: "เกิดข้อผิดพลาดแสดงข้อมูลไม่สำเร็จ !",
      detail: error.toString(),
    });
  }
});

module.exports = router;
