const { Router } = require("express");
const checkAuth = require("../middlewares/auth.middleware");
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
  fetchGroupDetails,
  joinGroup,
  leaveGroup,
  deleteGroup,
} = require("../controllers/group.controller");

const router = Router();

router.post("/", checkAuth, createGroup);
router.post("/create_post", checkAuth, createGroupPost);
router.get("/", checkAuth, fetchMyCreatedGroups);
router.get("/my_posts", checkAuth, fetchMyCreatedGroupPosts);
router.get("/suggestions", checkAuth, fetchGroupSuggestions);
router.get("/invited", checkAuth, fetchGroupsInvited);
router.get("/joined", checkAuth, fetchGroupsJoined);
router.get("/notifications", checkAuth, fetchGroupNotifications);
router.get("/feed", checkAuth, fetchGroupsFeed);

router.get("/:groupId", checkAuth, fetchGroupDetails);
router.patch("/:groupId/join", checkAuth, joinGroup);
router.delete("/:groupId/leave", checkAuth, leaveGroup);
router.delete("/:groupId/remove", checkAuth, deleteGroup);

module.exports = router;
