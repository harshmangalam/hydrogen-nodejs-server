const { Router } = require("express");
const router = Router();
const checkAuth = require("../middlewares/auth.middleware");

const {
  createPost,
  deletePost,
  fetchPost,
  fetchPosts,
} = require("../controllers/post.controller");
router.get("/", fetchPosts);
router.get("/:postId", fetchPost);
router.post("/", checkAuth, createPost);
router.delete("/:postId", checkAuth, deletePost);

module.exports = router;
