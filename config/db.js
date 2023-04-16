const mongoose = require("mongoose");
require("dotenv").config();

const { URI } = process.env;

const db_sync = async () => {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Couldn't connect to MongoDB");
  }
};

module.exports = { db_sync };
