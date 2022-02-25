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
    const currentUser = res.locals.user;
    const posts = await db.groupPost.findMany({
      where: {
        author: {
          id: currentUser.id,
        },
      },
    });

    return res.status(200).json({
      type: "success",
      message: "fetch create group posts",
      data: {
        posts,
      },
    });
  } catch (error) {
    next(error);
  }
};
const fetchMyCreatedGroups = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const groups = await db.group.findMany({
      where: {
        admin: {
          id: currentUser.id,
        },
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Fetch my created groups",
      data: {
        groups,
      },
    });
  } catch (error) {
    next(error);
  }
};
const fetchGroupsInvited = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const groups = await db.group.findMany({
      where: {
        invitedPeople: {
          some: {
            id: currentUser.id,
          },
        },
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Fetch groups invited",
      data: {
        groups,
      },
    });
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
    const currentUser = res.locals.user;
    const posts = await db.groupPost.findMany();
    return res.status(200).json({
      type: "success",
      message: "Fetch group feed ",
      data: {
        posts,
      },
    });
  } catch (error) {
    next(error);
  }
};
const fetchGroupsJoined = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const groups = await db.group.findMany({
      where: {
        members: {
          some: {
            id: currentUser.id,
          },
        },
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Fetch joined groups",
    });
  } catch (error) {
    next(error);
  }
};
const createGroup = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const { name, coverImage, privacy } = req.body;
    const group = await db.group.create({
      data: {
        name,
        coverImage,
        privacy,
        admin: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    return res.status(201).json({
      type: "success",
      message: "Group created successfully",
      data: {
        group,
      },
    });
  } catch (error) {
    next(error);
  }
};
const createGroupPost = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const { content, image, groupId } = req.body;
    const post = await db.groupPost.create({
      data: {
        content,
        image,
        author: {
          connect: {
            id: currentUser.id,
          },
        },
        group: {
          connect: {
            id: groupId,
          },
        },
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Group post created. Will publish when approve from group admin",
      data: {
        post,
      },
    });
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
