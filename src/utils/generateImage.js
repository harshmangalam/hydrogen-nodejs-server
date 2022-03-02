const crypto = require("crypto");

const randomHash = (str) => {
  return crypto.createHash("md5").update(str).digest("hex");
};

const generateRandomImage = ({ str, type = "identicon", size = 200 }) => {
  const md5Hash = randomHash(str);
  return `https://www.gravatar.com/avatar/${md5Hash}?d=${type}&s=${size}`;
};

module.exports = {
  generateRandomImage,
};
