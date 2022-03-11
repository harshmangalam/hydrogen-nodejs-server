const { fetchCurrentUser } = require("./fetchCurrentUser");
const { login } = require("./login");
const { logout } = require("./logout");
const { signup } = require("./signup");

module.exports = {
  login,
  signup,
  logout,
  fetchCurrentUser,
};
