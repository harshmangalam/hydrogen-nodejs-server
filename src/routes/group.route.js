const { Router } = require("express");
const { fetchGroupSuggestions } = require("../controllers/group.controller");
const checkAuth = require("../middlewares/admin.middleware");
const {
  fetchGroupSuggestions,
  createGroup,
  createGroupPost,
  fetchMyCreatedGroups,
  fetchGroupsInvited,
  fetchMyCreatedGroupPosts,
  fetchGroupNotifications,
  fetchGroupsFeed,
  fetchGroupsJoined,
} = require("../controllers/group.controller");

const router = Router();

router.post("/", checkAuth, createGroup);
router.post("/create_post", checkAuth, createGroupPost);
router.get("/", checkAuth, fetchMyCreatedGroups);
router.get("/my_posts", checkAuth, fetchMyCreatedGroupPosts);
router.get("/suggestions", fetchGroupSuggestions);
router.get("/invited", checkAuth, fetchGroupsInvited);
router.get("/joined", checkAuth, fetchGroupsJoined);
router.get("/notifications", checkAuth, fetchGroupNotifications);
router.get("/feed", checkAuth, fetchGroupsFeed);
module.exports = router;
