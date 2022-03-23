const { Router } = require("express");
const {
  comments,
  groupPosts,
  groups,
  loginHistory,
  messages,
  notifications,
  posts,
  users,
} = require("../controllers/admin.controller");

const router = Router();

router.post("/users", users);
router.get("/groups", groups);
router.get("/groupPosts", groupPosts);
router.get("/comments", comments);
router.get("/loginHistory", loginHistory);
router.get("/messages", messages);
router.get("/posts", posts);
router.get("/notifications", notifications);

module.exports = router;
