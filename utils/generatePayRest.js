const { generateToken } = require("./tokens");
const bcrypt = require("bcrypt");

function generatePayloadRestore(data) {
  const salt = bcrypt.genSaltSync();
  const payload = {
    name: data.name,
    lastName: data.lastName,
    email: data.email,
    salt: salt,
  };
  const token = generateToken(payload);
  return { token, payload };
}

module.exports = { generatePayloadRestore };
