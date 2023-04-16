const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const restore = new Schema({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiration: {
    type: Date,
    required: true,
    expires: 0
  }
});

const Restore = mongoose.model("Restore", restore);

module.exports = Restore;