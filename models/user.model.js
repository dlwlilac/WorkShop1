const mongoose = require("mongoose");
const { Schema } = mongoose;


const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
    },
    surname: {
      type: String,
    },
    tel: {
      type: String,
    },
    role: {
      type: String,
      // required: true,
    },
    active: {
      type: String,
      // required : true
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", userSchema);
