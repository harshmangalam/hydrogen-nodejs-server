const { acceptFriendRequest } = require("./acceptFriendRequest.controller");
const { sendFriendRequest } = require("./sendFriendRequest.controller");
const { removeFromFriendslist } = require("./removeFriend.controller");
const { cancelSentRequest } = require("./cancelSentRequest.controller");
const { ignoreReceivedRequest } = require("./ignoreRequest.controller");

const {
  fetchFriends,
  fetchFriendsRequestsReceived,
  fetchFriendsRequestsSent,
  fetchFriendsSuggestion,
} = require("./fetchFriends.controller");

module.exports = {
  acceptFriendRequest,
  sendFriendRequest,
  removeFromFriendslist,
  cancelSentRequest,
  ignoreReceivedRequest,
  fetchFriends,
  fetchFriendsRequestsReceived,
  fetchFriendsRequestsSent,
  fetchFriendsSuggestion,
};
