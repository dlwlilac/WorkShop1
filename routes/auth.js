var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
const userModel = require("../models/user.model");
// const productModel = require("../models/product.model");
// const orderModel = require("../models/order.model");
const jwt = require("jsonwebtoken");
const { AuthCheck } = require("../middleware/auth");

// เข้าสู่ระบบ
router.post("/login", async function (req, res, next) {
  try {
    let { username, password } = req.body; // ดึงข้อมูล Username กับ Password ที่ผู้ใช้กรอกมา

    let CheckUsername = await userModel.findOne({ username: username }); // เช็ค Username กับฐานข้อมูล

    let CheckPassword = await bcrypt.compare(password, CheckUsername.password); // เข้ารหัส bcrypt แล้วเช็คกับฐานข้อมูล

    if (!CheckUsername || !CheckPassword) {
      // ตรวจสอบว่า Username กับ Password ถูกไหม

      return res.status(400).send({
        status: 400,
        message: "username or password not correct ! Please try again",
      });
    }

    if (CheckUsername.active == "noactive") {
      return res.status(400).send({
        status: 400,
        message: "ไม่มีสิทธิใช้งานระบบ กรุณาติดต่อผู้ดูแลระบบเพื่อขอสิทธิในการเข้าใช้งาน",
      });
    }

    if (CheckUsername.active == "active") {
      const token = jwt.sign(
        // jwt token
        {
          id: CheckUsername._id,
          username: CheckUsername.username,
          password: CheckUsername.password,
          role: CheckUsername.role,
          active: CheckUsername.active,
        },
        process.env.JWT_KEY,
        { expiresIn: "1d" }
      );

      return res.status(200).send({
        status: 200,
        message: "Login Success",
        data: CheckUsername,
        token: token,
      });
    } else {
      res.status(400).send({
        status: 400,
        message: "Can't Login Please Try Again!",
      });
    }
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: "Login Unsuccess!",
      detail: error.toString(),
    });
  }
});

// สมัคร
router.post("/register", async function (req, res, next) {
  try {
    let { username, password, firstname, surname, role, tel, active } =
      req.body; // Input

    let CheckUsername = await userModel.findOne({ username: username });
    if (CheckUsername) {
      return res.status(400).send({
        status: 400,
        message: "Username นี้มีในระบบแล้ว",
      });
    }

    let EncodePassword = await bcrypt.hash(password, 10); // Encode Password

    let NewUser = new userModel({
      username: username,
      password: EncodePassword,
      firstname: firstname,
      surname: surname,
      tel: tel,
      role: role || "user", //user or admin
      active: active || "noactive", // active or noactive
    });

    let save = await NewUser.save();

    return res.status(200).send({
      status: 200,
      message: "register success",
      data: save,
    });
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: "register unsuccess",
      detail: error.toString(),
    });
  }
});

// แก้ไขสิทธิการเข้าถึง
router.put("/approve/:id", AuthCheck, async function (req, res, next) {
  try {
    let users = await userModel.findById(req.auth.id);

    if (users.role == "user") {
      return res.send({
        status: 200,
        message: "ไม่มีสิทธิใช้งานระบบ กรุณาติดต่อผู้ดูแลระบบเพื่อขอสิทธิในการเข้าใช้งาน",
      });
    }

    if (users.role == "admin") {
      let { active } = req.body;
      let UpdateActive = await userModel.findByIdAndUpdate(
        req.params.id,
        { active },
        { new: true }
      );

      return res.status(200).send({
        status: 200,
        message: "Update Approve Success",
        data: UpdateActive,
      });
    }
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: "Unsuccess",
      detail: error.toString(),
    });
  }
});

module.exports = router;
