const { acceptFriendRequest } = require("./acceptFriendRequest");
const { sendFriendRequest } = require("./sendFriendRequest");
const { removeFromFriendslist } = require("./removeFromFriendList");
const { cancelSentRequest } = require("./cancelSentRequest");
const { ignoreReceivedRequest } = require("./ignoreReceivedRequest");

const {
  fetchFriends,
  fetchFriendsRequestsReceived,
  fetchFriendsRequestsSent,
  fetchFriendsSuggestion,
} = require("./fetchFriends");

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
