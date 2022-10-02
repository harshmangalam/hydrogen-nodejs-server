const { createComment } = require("./createComment");
const { fetchComments } = require("./fetchComments");
const { deleteComment } = require("./deleteComment");

module.exports = {
  createComment,
  deleteComment,
  fetchComments,
};
