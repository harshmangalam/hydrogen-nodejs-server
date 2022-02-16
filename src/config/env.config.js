const PORT = process.env.PORT || "5000";
const ORIGIN = process.env.ORIGIN || "[]";
const JWT_SECRET = process.env.JWT_SECRET || "itssecret";
module.exports = {
  PORT,
  ORIGIN,
  JWT_SECRET
};
