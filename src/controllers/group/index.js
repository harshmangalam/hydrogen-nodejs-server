const { acceptGroupInvitation } = require("./acceptGroupInvitation");
const { createGroup } = require("./createGroup");
const { createGroupPost } = require("./createGroupPost");
const { deleteGroup } = require("./deleteGroup");
const { fetchGroupSuggestions } = require("./fetchGroupSuggestions");
const { fetchGroupNotifications } = require("./fetchGroupnotifications");
const { fetchGroups } = require("./fetchGroups");
const { fetchGroupsInvited } = require("./fetchGroupsInvited");
const { fetchGroupsJoined } = require("./fetchGroupsJoined");
const { fetchGroupsFeed } = require("./fetchGroupsFeed");
const { fetchMyCreatedGroupPosts } = require("./fetchmyCreatedGroupPosts");
const { fetchMyCreatedGroups } = require("./fetchMyCreatedGroups");
const { fetchGroupDetails } = require("./fetchGroupDetails");
const { joinGroup } = require("./joinGroup");
const { leaveGroup } = require("./leaveGroup");
const { rejectGroupInvitation } = require("./rejectGroupInvitation");

module.exports = {
  fetchGroupSuggestions,
  createGroup,
  createGroupPost,
  fetchGroups,
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

  acceptGroupInvitation,
  rejectGroupInvitation,
};
