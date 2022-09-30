const PORT = process.env.PORT || "5000";
const ORIGIN = process.env.ORIGIN || "http://localhost:3000";
const JWT_SECRET = process.env.JWT_SECRET || "itssecret";
const NODE_ENV = process.env.NODE_ENV || "dev";
module.exports = {
  PORT,
  ORIGIN,
  JWT_SECRET,
  NODE_ENV,
};
