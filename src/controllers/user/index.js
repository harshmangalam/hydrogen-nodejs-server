const { uploadProfilePic } = require("./uploadProfilePic");
const { fetchUserPosts } = require("./fetchUserPosts");
const { fetchUserDetails } = require("./fetchUserDetails");
const { fetchFriends } = require("./fetchFriends");
const { changePassword } = require("./changePassword");

module.exports = {
  uploadProfilePic,
  fetchFriends,
  fetchUserDetails,
  fetchUserPosts,
  changePassword,
};
