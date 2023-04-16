const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("dotenv").config();
const { ALPHA, ALPHAT, BETA, BETAT, GAMA, GAMAT, OMEGA, OMEGAT } = process.env;
const bcrypt = require("bcrypt");
const pointSchema = require("./pointSchema");

const user = new Schema({
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    set: function (value) {
      if (value === ALPHAT) return ALPHA;
      if (value === BETAT) return BETA;
      if (value === GAMAT) return GAMA;
      if (value === OMEGAT) return OMEGA;
      throw new TypeError("Invalid credentials");
    },
  },
  role: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    lowercase: true,
    unique: true,
    match: [
      /^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,})+$/,
      "Please fill a valid email address",
    ],
  },
  addressName: {
    type: String,
  },
  addressCoor: {
    type: pointSchema,
    index: "2dsphere",
  },
  geoLocation: {
    type: pointSchema,
    index: "2dsphere",
  },
  picture: {
    type: String,
  },
  office: {
    type: mongoose.ObjectId,
    ref: "Office",
  },
  activeReports: {
    type: Number,
    default: 0,
  },
  issuerMessages: [
    {
      chatId: { type: String },
      chatLength: { type: Number },
      chatRoom: { type: String },
    },
  ],
  solverMessages: [
    {
      chatId: { type: String },
      chatLength: { type: Number },
      chatRoom: { type: String },
    },
  ],
});

user.methods.encryptPassword = function (password, salt) {
  return bcrypt.hash(password, salt);
};

user.methods.validatePassword = async function (password) {
  try {
    const hash = await this.encryptPassword(password, this.salt);
    return hash === this.password;
  } catch (error) {
    console.error(error);
  }
};

user.pre("save", async function (next) {
  let userInstance = this;
  if (!userInstance.isModified("password")) return next();
  const salt = bcrypt.genSaltSync();
  userInstance.salt = salt;
  try {
    const hashPass = await userInstance.encryptPassword(
      userInstance.password,
      salt
    );
    userInstance.password = hashPass;
    return next();
  } catch (error) {
    return next(error);
  }
});

const User = mongoose.model("User", user);
module.exports = User;
