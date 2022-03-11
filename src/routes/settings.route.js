const { Router } = require("express");
const {
  fetchLoginHistory,
  removeLoginHistory,
} = require("../controllers/settings");
const checkAuth = require("../middlewares/auth.middleware");
const router = Router();

router.get("/accounts_loggedin", checkAuth, fetchLoginHistory);
router.delete("/accounts_loggedin", checkAuth, removeLoginHistory);

module.exports = router;
