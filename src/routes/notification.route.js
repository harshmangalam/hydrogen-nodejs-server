const { Router } = require("express");
const checkAuth = require("../middlewares/auth.middleware")
const {fetchNotifications} = require("../controllers/notification.controller")
const router = Router();


router.get("/",checkAuth,fetchNotifications)
module.exports = router;
