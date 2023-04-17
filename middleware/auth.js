const { validateToken } = require("../utils/tokens");

function validateUser(req, res, next) {
  const bearer = req.headers.authorization
  if (!bearer || !bearer.startsWith('Bearer ')) return res.status(401).send("Invalid credentials");
  const token = bearer.substring(7)
  if (token.length < 10) return res.status(401).send("Invalid credentials");
  const { payload } = validateToken(token);
  if (!payload) return res.status(401).send("Invalid credentials");
  req.user = payload;
  next();
}

module.exports = { validateUser };

/* 
  Cookies Mode:
  const token = req.cookies.token;
  if (!token) return res.status(401).send("Invalid credentials"); 
*/