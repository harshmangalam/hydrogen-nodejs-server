const { Router } = require("express");
const router = Router();
const checkAuth = require("../middlewares/auth.middleware");

const {
  createPost,
  deletePost,
  fetchPost,
  fetchPosts,
  fetchTrendingPosts,
  fetchFeedPosts,
  fetchFriendsPosts,
  addRemoveLike,
} = require("../controllers/post.controller");

router.post("/", checkAuth, createPost);
router.get("/", fetchPosts);
router.get("/trending", checkAuth, fetchTrendingPosts);
router.get("/feed", checkAuth, fetchFeedPosts);
router.get("/friends", checkAuth, fetchFriendsPosts);
router.get("/:postId", checkAuth, fetchPost);
router.delete("/:postId", checkAuth, deletePost);

router.patch("/:postId/add_remove_like", checkAuth, addRemoveLike);

module.exports = router;
