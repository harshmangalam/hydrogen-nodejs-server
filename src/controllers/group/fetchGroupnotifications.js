const { db } = require("../../utils/db");

exports.fetchGroupNotifications = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const notifications = await db.notifications.findMany({
      where: {
        AND: [
          {
            type: "GROUP",
          },
          {
            OR: [
              {
                toUserId: currentUser.id,
              },
              {
                fromUserId: currentUser.id,
              },
            ],
          },
        ],
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Fetch group notifications",
      data: {
        notifications,
      },
    });
  } catch (error) {
    next(error);
  }
};
