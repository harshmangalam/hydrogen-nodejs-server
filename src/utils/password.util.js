const bcrypt = require("bcrypt");

// match plain password and hashed password
exports.checkPassword = async (password, hashedPassword) => {
  const matchPassword = await bcrypt.compare(password, hashedPassword);
  return matchPassword;
};

// hash plain password into hashed password
exports.hashPassword = async (password) => {
  const hashed = await bcrypt.hash(password, 12);
  return hashed;
};