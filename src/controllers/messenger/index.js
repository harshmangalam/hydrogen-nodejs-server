const { fetchMessages } = require("./fetchMessages");
const { fetchMessenger } = require("./fetchMessenger");
const { sendMessage } = require("./sendMessage");
const { clearAllMessages } = require("./clearAllMessages");

module.exports = {
  fetchMessages,
  fetchMessenger,
  sendMessage,
  clearAllMessages
};
