const { db } = require("../utils/db");

const fetchGroupSuggestions = async (req, res, next) => {
  try {
    const groups = await db.group.findMany();
    return res.status(200).json({
      type: "success",
      message: "Fetch groups suggestion",
      body: {
        groups,
      },
    });
  } catch (error) {
    next(error);
  }
};
const fetchMyCreatedGroupPosts = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
const fetchMyCreatedGroups = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
const fetchGroupsInvited = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
const fetchGroupNotifications = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
const fetchGroupsFeed = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
const fetchGroupsJoined = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
const createGroup = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
const createGroupPost = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

module.exports = {
  fetchGroupSuggestions,
  createGroup,
  createGroupPost,
  fetchMyCreatedGroups,
  fetchGroupsInvited,
  fetchMyCreatedGroupPosts,
  fetchGroupNotifications,
  fetchGroupsFeed,
  fetchGroupsJoined,
};
