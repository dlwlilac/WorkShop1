const mongoose = require("mongoose");
const { Schema } = mongoose;

const users = require("./user.model");
const products = require("./product.model");

const orderSchema = new Schema({
  productID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products", // อ้างอิงจาก products
    required: true,
  },
  UserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users", // อ้างอิงจาก users
    required: true,
  },
  // username:{
  //   type: String
  // },
  // name:{
  //   type: String
  // },
  amount: {
    type: Number,
  },
  total: {
    type: Number,
  },
});

module.exports = mongoose.model("orders", orderSchema);
