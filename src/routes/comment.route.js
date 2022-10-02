const { Router } = require("express");
const { createComment, fetchComments, deleteComment } = require("../controllers/comments");
const checkAuth = require("../middlewares/auth.middleware");
const router = Router();

router.post("/:postId", checkAuth, createComment);
router.delete("/:commentId", deleteComment);
router.get("/:postId", checkAuth, fetchComments);

module.exports = router;
