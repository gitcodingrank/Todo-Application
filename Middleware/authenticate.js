const jwt = require("jsonwebtoken");
const { blackList } = require("../blackList");

const authT = (req, res, next) => {
  try {
    const token = req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : null;
    if (!token) {
      return res.status(400).json({ msg: "Token not found" });
    }
    if (blackList.includes(token)) {
      return res.status(401).json({ msg: "Logout out, kindly login again" });
    }
    jwt.verify(token, "nethravathi", (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          // Optionally, handle expired token separately
          return res.status(401).json({ msg: "Token expired" });
        } else {
          return res.status(401).json({ msg: "Invalid token" });
        }
      }
      console.log("Authentication done");
      // If token is valid, you can optionally attach user information to the request object
      req.user = decoded;
      req.body.userId = decoded.user.id
      next();
    });
  } catch (error) {
    console.error("Error in authentication middleware:", error);
    res.status(500).json({ err: "Internal server error" });
  }
};

module.exports = { authT };