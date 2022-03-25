const { Router } = require("express");
const router = Router();
const checkAuth = require("../middlewares/auth.middleware");

const {
  createPost,
  deletePost,
  fetchTrendingPosts,
  fetchFeedPosts,
  fetchFriendsPosts,
  addRemoveLike,
  fetchPostDetails,
  fetchPostLikesUser,
  fetchMyPosts,
} = require("../controllers/post");

router.post("/", checkAuth, createPost);
router.get("/my_posts", checkAuth, fetchMyPosts);
router.get("/trending", checkAuth, fetchTrendingPosts);
router.get("/feed", checkAuth, fetchFeedPosts);
router.get("/friends", checkAuth, fetchFriendsPosts);
router.get("/:postId", fetchPostDetails);
router.get("/:postId/likes", fetchPostLikesUser);

router.delete("/:postId", checkAuth, deletePost);

router.patch("/:postId/add_remove_like", checkAuth, addRemoveLike);

module.exports = router;
