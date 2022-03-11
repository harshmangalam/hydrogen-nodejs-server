const { Router } = require("express");
const checkAuth = require("../middlewares/auth.middleware");

const router = Router();

const {
  uploadProfilePic,
  fetchUserDetails,
  fetchFriends,
  fetchUserPosts,
} = require("../controllers/user.controller");

router.patch("/upload_profile_pic", checkAuth, uploadProfilePic);
router.get("/:userId", fetchUserDetails);
router.get("/:userId/all_friends", checkAuth, fetchFriends);
router.get("/:userId/posts", checkAuth, fetchUserPosts);


module.exports = router;
