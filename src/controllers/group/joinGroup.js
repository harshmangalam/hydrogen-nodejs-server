const { db } = require("../../utils/db");
const { createNotification, countNotifications } = require("../../utils/notification");
exports.joinGroup = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const groupId = req.params.groupId;
    const findGroup = await db.group.findUnique({
      where: {
        id: groupId,
      },
      select: {
        id: true,
      },
    });

    if (!findGroup) {
      return next({ status: 404, message: "Group not found" });
    }

    const alreadyMember = await db.group.findFirst({
      where: {
        AND: [
          {
            id: groupId,
          },
          {
            members: {
              some: {
                id: currentUser.id,
              },
            },
          },
        ],
      },
      select: {
        id: true,
      },
    });

    if (alreadyMember) {
      return next({
        status: 400,
        message: "You are already member of this group",
      });
    }

    const group = await db.group.update({
      where: {
        id: groupId,
      },
      data: {
        members: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        admin: {
          select: {
            id: true,
            socketId: true,
          },
        },
      },
    });
    res.status(201).json({
      type: "success",
      message: "Group joined successfully",
      data: null,
    });
    const notification = await createNotification({
      content: `has joined ${group.name} group`,
      fromUserId: currentUser.id,
      toUserId: group.admin.id,
      type: "GROUP",
    });

    const count = await countNotifications(group.admin.id);
    req.io
      .to(group.admin.socketId)
      .emit("notification", { notification, count });
  } catch (error) {
    next(error);
  }
};
