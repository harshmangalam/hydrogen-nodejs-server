const { db } = require("./db");

const createNotification = async ({ fromUserId, toUserId, content, type }) => {
  const notification = await db.notifications.create({
    data: {
      type: type,
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

  return notification;
};

const countNotifications = async (toUserId) => {
  const count = await db.notifications.count({
    where: {
      toUserId,
    },
  });

  return count;
};

module.exports = {
  createNotification,

  countNotifications,
};
