var express = require("express");
var router = express.Router();
// var bcrypt = require("bcrypt");
var userSchema = require("../models/user.model"); // เรียกใช้จาก Models

router.get("/", async function (req, res, next) {
  // ดึงข้อมูล
  try {
    let users = await userSchema.find();
    return res.send(users);
  } catch (error) {
    return res.status(500).send(error.toString());
  }
});

router.get("/:id", async function (req, res, next) {
  // ดึงข้อมูล
  let { id } = req.params;
  // let { search, limit } = req.query;
  try {
    let users = await userSchema.findById(id);
    return res.send(users);
  } catch (error) {
    return res.status(500).send(error.toString());
  }
});

router.post("/", async function (req, res, next) {
  // เพิ่ม
  try {
    let { username, password, firstname, surname, tel, role, active } = req.body;

    let user = new userSchema({
      username: username,
      password: password,
      firstname: firstname,
      surname: surname,
      tel: tel,
      active: active
    });
    await user.save();
    return res.send({
      message: "Create Success",
      CreateUser:{
        username: username,
        password: password,
        firstname: firstname,
        surname: surname,
        tel: tel,
        active: active
      }
    })
  } catch (error) {
    return res.status(500).send(error.toString());
  }
});

router.put("/:id", async function (req, res, next) {
  // แก้ไข
  try {
    let { id } = req.params;
    let { name, age } = req.body;

    let updatedUser = await userSchema.findByIdAndUpdate(id, {id, name, age },{new: true});

    return res.send({
      message: "Update success",
      updatedUser: {
        id: updatedUser.id,
        name: updatedUser.name,
        age: updatedUser.age,
      },
    });
  } catch (error) {
    return res.status(500).send(error.toString());
  }
});

router.delete("/:id", async function (req, res, next) {
  // ลบ
  try {
    let { id } = req.params;

    let DeleteUser = await userSchema.findByIdAndDelete(id);

    return res.send({
      message: "Delete success",
      DeleteUser: {
        id: DeleteUser.id,
      },
    });
  } catch (error) {
    return res.status(500).send(error.toString());
  }
});

module.exports = router;
