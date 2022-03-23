const { uploadProfilePic } = require("./uploadProfilePic");
const { fetchUserPosts } = require("./fetchUserPosts");
const { fetchUserDetails } = require("./fetchUserDetails");
const { fetchFriends } = require("./fetchFriends");
const { changePassword } = require("./changePassword");
const { updateUserDetails } = require("./updateUserDetails");

module.exports = {
  uploadProfilePic,
  fetchFriends,
  fetchUserDetails,
  fetchUserPosts,
  changePassword,
  updateUserDetails,
};
