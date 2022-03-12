const { Router } = require("express");
const {
  fetchLoginHistory,
  removeLoginHistory,
} = require("../controllers/settings");
const checkAuth = require("../middlewares/auth.middleware");
const router = Router();

router.get("/login_history", checkAuth, fetchLoginHistory);
router.delete("/login_history", checkAuth, removeLoginHistory);

module.exports = router;
