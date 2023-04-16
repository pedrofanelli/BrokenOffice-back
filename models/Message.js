const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const message = new Schema({
  user: {
    type: mongoose.ObjectId,
    ref: "User",
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const Message = mongoose.model("Message", message);

module.exports = Message;
