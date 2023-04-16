const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const pointSchema = require("./pointSchema")

const office = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    street: {
      type: String,
      required: true
    },
    zip: {
      type: String,
      required: true
    },
    floor: {
      type: String
    }
  },
  location: {
    type: pointSchema,
    required: true,
    index: '2dsphere'
  },
  openReports:{
    type: Number,
    default: 0
  }
});

const Office = mongoose.model("Office", office);

module.exports = Office;