const { db } = require("./db");

exports.createNotification = async ({
  fromUserId,
  toUserId,
  content,
  type,
}) => {
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

exports.countNotifications = async (toUserId) => {
  const count = await db.notifications.count({
    where: {
      toUserId,
    },
  });

  return count;
};
