const { Router } = require("express");
const checkAuth = require("../middlewares/auth.middleware");
const {
  fetchNotifications,
  clearNotifications,
} = require("../controllers/notification.controller");
const router = Router();

router.get("/", checkAuth, fetchNotifications);
router.delete("/", checkAuth, clearNotifications);

module.exports = router;
