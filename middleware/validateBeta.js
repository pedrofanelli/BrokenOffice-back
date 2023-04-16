require("dotenv").config();
const { BETA } = process.env;

function validateBeta(req, res, next) {
  const user = req.user;
  if (user.type !== BETA) return res.status(401).send("Invalid credentials");
  next();
}

module.exports = { validateBeta };
