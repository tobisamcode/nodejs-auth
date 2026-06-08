const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  // decode the token
  try {
    const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET);
    req.userInfo = decodedTokenInfo;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error occurred while validating token." });
  }
};

module.exports = authMiddleware;
