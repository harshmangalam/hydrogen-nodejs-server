const { Router } = require("express");
const {
  comments,
  groupPosts,
  groups,
  loginHistory,
  notifications,
  posts,
  users,
  overview,
} = require("../controllers/admin.controller");

const router = Router();

router.get("/", overview);
router.get("/users", users);
router.get("/groups", groups);
router.get("/groupPosts", groupPosts);
router.get("/comments", comments);
router.get("/loginHistory", loginHistory);
router.get("/posts", posts);
router.get("/notifications", notifications);

module.exports = router;
