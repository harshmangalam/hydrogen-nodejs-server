const { Router } = require("express");
const {
  fetchFriendsRequestsReceived,
  fetchFriendsRequestsSent,
  sendFriendRequest,
  acceptFriendRequest,
  removeFromFriendslist,
  fetchFriendsSuggestion,
  fetchFriends,
} = require("../controllers/friends.controller");
const checkAuth = require("../middlewares/auth.middleware");

const router = Router();

router.get("/", checkAuth, fetchFriends);
router.get("/suggestions", checkAuth, fetchFriendsSuggestion);
router.get("/sent_requests", checkAuth, fetchFriendsRequestsSent);
router.get("/received_requests", checkAuth, fetchFriendsRequestsReceived);
router.post("/send_request/:userId", checkAuth, sendFriendRequest);
router.post("/accept_request/:userId", checkAuth, acceptFriendRequest);
router.post("/remove/:userId", checkAuth, removeFromFriendslist);

module.exports = router;
