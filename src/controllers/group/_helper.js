const { db } = require("../../utils/db");

exports.createNotification = async ({ fromUserId, toUserId, content }) => {
  const notification = await db.notifications.create({
    data: {
      type: "GROUP",
      fromUserId,
      toUserId,
      content,
    },
    include: {
      fromUser: {
        select: {
          id: true,
          firstName: true,
          profileImage: true,
        },
      },
    },
  });

  const count = await db.notifications.count({
    where: {
      toUserId,
    },
  });

  return { notification, count };
};

exports.includeGroupPost = {
  _count: {
    select: {
      likes: true,
    },
  },
  author: {
    select: {
      id: true,
      firstName: true,
      profileImage: true,
      status: true,
    },
  },
  group: {
    select: {
      id: true,
      name: true,
      profileImage: true,
    },
  },
};

exports.hasLikePost = async (userId, postId) => {
  const likes = await db.user.count({
    where: {
      AND: [
        {
          id: userId,
        },
        {
          groupPostLikes: {
            some: {
              id: postId,
            },
          },
        },
      ],
    },
  });

  return likes ? true : false;
};
