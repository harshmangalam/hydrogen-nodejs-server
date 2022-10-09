const { db } = require("../utils/db");
exports.users = async (req, res, next) => {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            friendsRequestsReceived: true,
            friendsRequestsSent: true,
            friendsOf: true,
            groupPostLikes: true,
            groupsCreated: true,
            groupPosts: true,
            invitedInGroups: true,
            likePosts: true,
            myFriends: true,
            taggedInPosts: true,
            loginHistory: true,
            membersInGroups: true,
            messagesReceived: true,
            messagesSent: true,
            postComments: true,
            posts: true,
          },
        },
      },
    });
    return res.status(200).json({
      type: "success",
      message: "fetch users",
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.loginHistory = async (req, res, next) => {
  try {
    const loginHistory = await db.loginHistory.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json({
      type: "success",
      message: "fetch login history",
      data: {
        loginHistory,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.posts = async (req, res, next) => {
  try {
    const posts = await db.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            comments: true,
            likes: true,
            specificAudienceFriends: true,
            taggedFriends: true,
          },
        },
        author: {
          select: {
            id: true,
            firstName: true,
          },
        },
        specificAudienceFriends: {
          select: {
            id: true,
            firstName: true,
          },
        },
        taggedFriends: {
          select: {
            id: true,
            firstName,
          },
        },
      },
    });
    return res.status(200).json({
      type: "success",
      message: "fetch posts",
      data: {
        posts,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.groups = async (req, res, next) => {
  try {
    const groups = await db.group.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            invitedPeople: true,
            members: true,
            posts: true,
          },
        },
        admin: {
          select: {
            id: true,
            firstName: true,
          },
        },
        invitedPeople: {
          select: {
            id: true,
            firstName: true,
          },
        },
        members: {
          select: {
            id: true,
            firstName,
          },
        },
      },
    });
    return res.status(200).json({
      type: "success",
      message: "fetch groups",
      data: {
        groups,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.groupPosts = async (req, res, next) => {
  try {
    const groupPosts = await db.groupPost.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            likes: true,
          },
        },
        author: {
          select: {
            id: true,
            firstName: true,
          },
        },
        group: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
    return res.status(200).json({
      type: "success",
      message: "fetch groupPosts",
      data: {
        groupPosts,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.notifications = async (req, res, next) => {
  try {
    const notifications = await db.notifications.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json({
      type: "success",
      message: "fetch notifications",
      data: {
        notifications,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.messages = async (req, res, next) => {
  try {
    const messages = await db.message.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        receiver: {
          select: {
            id: true,
            firstName: true,
          },
        },
        sender: {
          select: {
            id: true,
            firstName: true,
          },
        },
      },
    });
    return res.status(200).json({
      type: "success",
      message: "fetch messages",
      data: {
        messages,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.comments = async (req, res, next) => {
  try {
    const comments = await db.comment.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json({
      type: "success",
      message: "fetch comments",
      data: {
        comments,
      },
    });
  } catch (error) {
    next(error);
  }
};
