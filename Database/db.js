const mongoose = require("mongoose");

const mongoHost = process.env.MONGODB_HOST;
const mongoPort = process.env.MONGODB_PORT;
const mongoDB = process.env.MONGODB_DB;

const mongoURI = `mongodb://${mongoHost}:${mongoPort}/${mongoDB}`;

mongoose
  .connect(mongoURI, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
