const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chat = new Schema({
  room: {
    type: mongoose.ObjectId,
    ref: "Report",
  },
  allMessages: [{
    type: mongoose.ObjectId,
    ref: "Message",
  }],
});

const Chat = mongoose.model("Chat", chat);

module.exports = Chat;

