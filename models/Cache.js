const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cache = new Schema({
  imgUrl: {
    type: String,
    required: true,
  },
});

const Cache = mongoose.model("Cache", cache);

module.exports = Cache;