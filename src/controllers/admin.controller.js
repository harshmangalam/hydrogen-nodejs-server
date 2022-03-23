const { db } = require("../utils/db");
exports.users = async (req, res, next) => {
  try {
    const users = await db.user.findMany();
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
    const loginHistory = await db.loginHistory.findMany();
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
    const posts = await db.post.findMany();
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
    const groups = await db.group.findMany();
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
    const groupPosts = await db.groupPost.findMany();
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
    const notifications = await db.notifications.findMany();
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
    const messages = await db.message.findMany();
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
    const comments = await db.comment.findMany();
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
