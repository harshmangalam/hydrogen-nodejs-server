const { Router } = require("express");
const {
  fetchFriendsRequestsReceived,
  fetchFriendsRequestsSent,
  sendFriendRequest,
  acceptFriendRequest,
  removeFromFriendslist,
  fetchFriendsSuggestion,
  fetchFriends,
  cancelSentRequest,
  ignoreReceivedRequest,
} = require("../controllers/friends.controller");
const checkAuth = require("../middlewares/auth.middleware");

const router = Router();

router.get("/", checkAuth, fetchFriends);
router.get("/suggestions", checkAuth, fetchFriendsSuggestion);
router.get("/sent_requests", checkAuth, fetchFriendsRequestsSent);
router.get("/received_requests", checkAuth, fetchFriendsRequestsReceived);
router.patch("/send_request/:userId", checkAuth, sendFriendRequest);
router.patch("/accept_request/:userId", checkAuth, acceptFriendRequest);
router.delete("/cancel_sent_request/:userId", checkAuth, cancelSentRequest);
router.delete(
  "/ignore_received_request/:userId",
  checkAuth,
  ignoreReceivedRequest
);
router.delete("/remove/:userId", checkAuth, removeFromFriendslist);

module.exports = router;
