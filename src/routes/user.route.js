const { Router } = require("express");
const checkAuth = require("../middlewares/auth.middleware");

const router = Router();

const { uploadProfilePic,fetchUserDetails } = require("../controllers/user.controller");

router.patch("/upload_profile_pic", checkAuth, uploadProfilePic);
router.get("/:userId", fetchUserDetails);

module.exports = router;
