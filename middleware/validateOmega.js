require("dotenv").config();
const { OMEGA } = process.env;

function validateOmega(req, res, next) {
  const user = req.user;
  if (user.type !== OMEGA) return res.status(401).send("Invalid credentials");
  next();
}

module.exports = { validateOmega };
