const { db } = require("../../utils/db");
const {
  createNotification,
  countNotifications,
} = require("../../utils/notification");

exports.rejectGroupInvitation = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const groupId = req.params.groupId;

    // check is invited
    const isInvited = await db.group.findFirst({
      where: {
        AND: [
          {
            id: groupId,
          },
          {
            invitedPeople: {
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

    if (!isInvited) {
      return next({
        status: 400,
        message: "You are not invited by group admin",
      });
    }

    // check is already member
    const isMember = await db.group.findFirst({
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

    if (isMember) {
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
          disconnect: {
            id: currentUser.id,
          },
        },
        invitedPeople: {
          disconnect: {
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
      message: "You have rejected group invitation",
      data: null,
    });

    const notification = await createNotification({
      content: `has rejected ${group.name} group invitation`,
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
