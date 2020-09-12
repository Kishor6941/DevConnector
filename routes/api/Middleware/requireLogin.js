const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  // Get Token from Header
  const getTokenFromHeader = req.header("x-auth-token");
  // check if not token
  if (!getTokenFromHeader) {
    return res.status(401).json({ msg: "No token, Authorization denied" });
  }
  // Verify token
  try {
    const decoded = jwt.verify(getTokenFromHeader, config.get("jwtsecret"));
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
