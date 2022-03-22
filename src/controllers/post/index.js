const { addRemoveLike } = require("./addRemoveLike");
const { createPost } = require("./createPost");
const { deletePost } = require("./deletePost");
const { fetchFeedPosts } = require("./fetchFeedPosts");
const { fetchFriendsPosts } = require("./fetchFriendPosts");
const { fetchPostDetails } = require("./fetchPostDetails");
const { fetchPosts } = require("./fetchPosts");
const { fetchTrendingPosts } = require("./fetchTrendingPosts");
const { fetchPostLikesUser } = require("./fetchPostLikesUser");

module.exports = {
  addRemoveLike,
  createPost,
  deletePost,
  fetchFeedPosts,
  fetchFriendsPosts,
  fetchPostDetails,
  fetchPosts,
  fetchTrendingPosts,
  fetchPostLikesUser
};
