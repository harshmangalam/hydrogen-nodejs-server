const { db } = require("../utils/db");

exports.fetchNotifications = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;

    const count = await db.notifications.count({
      where: {
        toUserId: currentUser.id,
      },
    });
    const notifications = await db.notifications.findMany({
      where: {
        toUserId: currentUser.id,
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

    return res.status(200).json({
      type: "success",
      message: "Fetch my notifications",
      data: {
        notifications,
        count,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.clearNotifications = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    await db.notifications.deleteMany({
      where: {
        toUserId: currentUser.id,
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Clear all notifications",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteNotificationGroup = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const groupId = req.params.groupId;

    // Look for the notification by id and type of GROUP
    const foundGroup = await db.notifications.findFirst({
      where: {
        fromUserId: currentUser.id,
        id: groupId,
        type: "GROUP",
      },
      select: {
        id: true,
      },
    });

    // Delete the group if present in the DB
    if (foundGroup != null) {
      await db.notifications.delete({
        where: {
          id: foundGroup.id,
        },
      });
    }

    return res.status(200).json({
      type: "success",
      message: "Delete notification group",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
