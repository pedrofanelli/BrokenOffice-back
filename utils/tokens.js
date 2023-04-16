const jwt = require("jsonwebtoken");
require("dotenv").config();
const { SECRET } = process.env;

const generateToken = (payload) => jwt.sign({payload}, SECRET, { expiresIn: "2d" });
const validateToken = (token) => jwt.verify(token, SECRET);

module.exports = { generateToken, validateToken };