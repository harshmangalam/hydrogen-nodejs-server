const { addRemoveLike } = require("./addRemoveLike");
const { createPost } = require("./createPost");
const { deletePost } = require("./deletePost");
const { fetchFeedPosts } = require("./fetchFeedPosts");
const { fetchFriendsPosts } = require("./fetchFriendPosts");
const { fetchPost } = require("./fetchPost");
const { fetchPosts } = require("./fetchPosts");
const { fetchTrendingPosts } = require("./fetchTrendingPosts");

module.exports = {
  addRemoveLike,
  createPost,
  deletePost,
  fetchFeedPosts,
  fetchFriendsPosts,
  fetchPost,
  fetchPosts,
  fetchTrendingPosts,
};
