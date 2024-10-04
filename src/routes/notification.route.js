const { Router } = require("express");
const checkAuth = require("../middlewares/auth.middleware");
const {
  clearNotifications,
  deleteNotificationGroup,
  fetchNotifications,
} = require("../controllers/notification.controller");
const router = Router();

router.get("/", checkAuth, fetchNotifications);
router.delete("/", checkAuth, clearNotifications);
router.delete("/groups/:groupId", checkAuth, deleteNotificationGroup);

module.exports = router;
