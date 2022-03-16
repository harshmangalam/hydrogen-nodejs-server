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
      include: {
        fromUser: {
          select: {
            id: true,
            profileImage: true,
            firstName: true,
          },
        },
        toUser: {
          select: {
            id: true,
            profileImage: true,
            firstName: true,
          },
        },
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
