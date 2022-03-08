const { Router } = require("express");
const {
  fetchMessages,
  fetchMessenger,
  sendMessage,
} = require("../controllers/messenger");
const checkAuth = require("../middlewares/auth.middleware");
const router = Router();

router.get("/", checkAuth, fetchMessenger);
router.get("/:friendId", checkAuth, fetchMessages);

router.post("/:friendId", checkAuth, sendMessage);
module.exports = router;
