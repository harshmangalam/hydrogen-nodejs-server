const { db } = require("../../utils/db");
const {
  createNotification,
  countNotifications,
} = require("../../utils/notification");

exports.deleteGroup = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const groupId = req.params.groupId;

    const group = await db.group.findUnique({
      where: {
        id: groupId,
      },
      select: {
        id: true,
        adminId: true,
      },
    });

    if (!group) {
      return next({ status: 404, message: "Group not found" });
    }

    const isGroupAdmin = group.adminId === currentUser.id;
    if (!isGroupAdmin) {
      return next({
        status: 401,
        message: "You`re not the admin of this group",
      });
    }

    const groupData = await db.group.findUnique({
      where: {
        id: groupId,
      },
      select: {
        name: true,
        members: {
          select: {
            id: true,
            socketId: true,
          },
        },
      },
    });

    for await (const user of groupData.members) {
      const notification = await createNotification({
        content: `has deleted ${groupData.name} group`,
        fromUserId: currentUser.id,
        toUserId: user.id,
        type: "GROUP",
      });
      const count = await countNotifications(user.id);

      req.io.to(user.socketId).emit("notification", { notification, count });
    }

    await db.group.delete({
      where: {
        id: groupId,
      },
    });

    res.status(201).json({
      type: "success",
      message: "Group deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
