const mongoose = require("mongoose");
const { mongodb_url } = require("../utils/secret");
require("dotenv").config();

const connectToDB = async () => {
  try {
    await mongoose.connect(mongodb_url, { dbName: process.env.DB_NAME });
    console.log("Connected to DB Successfully");

    mongoose.connection.on("error", (error) => {
      console.error("DB connection error: ", error);
    });
  } catch (error) {
    console.error("Couldn't connect to DB: ", error.toString());
  }
};

module.exports = connectToDB;
