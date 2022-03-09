const { Router } = require("express");
const {
  fetchMessages,
  fetchMessenger,
  sendMessage,
  clearAllMessages
} = require("../controllers/messenger");
const checkAuth = require("../middlewares/auth.middleware");
const router = Router();

router.get("/", checkAuth, fetchMessenger);
router.get("/:friendId", checkAuth, fetchMessages);

router.post("/:friendId", checkAuth, sendMessage);
router.delete("/:friendId", checkAuth, clearAllMessages);
module.exports = router;
