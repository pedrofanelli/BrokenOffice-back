require("dotenv").config();
const { GAMA } = process.env;

function validateOAB(req, res, next) {
  const user = req.user;
  if (user.type === GAMA ) return res.status(401).send("Invalid credentials");
  next();
}

module.exports = { validateOAB };
