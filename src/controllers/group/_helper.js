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
