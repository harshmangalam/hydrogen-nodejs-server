const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env.config");

// generate json web token from payload of userId 
exports.createJwtToken = (payload) => {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "12h" });
  return token;
};

// verify incomming json web token  and extract payload from it 
exports.verifyJwtToken = (token, next) => {
  try {
    const { userId } = jwt.verify(token, JWT_SECRET);
    return userId;
  } catch (err) {
    next(err);
  }
};