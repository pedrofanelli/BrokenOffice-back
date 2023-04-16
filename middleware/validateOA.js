require("dotenv").config();
const { ALPHA, OMEGA } = process.env;

function validateOA(req, res, next) {
  const user = req.user;
  if (user.type !== ALPHA && user.type !== OMEGA) return res.status(401).send("Invalid credentials");
  next();
}

module.exports = { validateOA };
