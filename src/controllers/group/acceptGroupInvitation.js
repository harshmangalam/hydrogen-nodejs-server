const { db } = require("../../utils/db");

exports.acceptGroupInvitation = async (req, res, next) => {
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

    await db.group.update({
      where: {
        id: groupId,
      },
      data: {
        members: {
          connect: {
            id: currentUser.id,
          },
        },
        invitedPeople: {
          disconnect: {
            id: currentUser.id,
          },
        },
      },
    });

    res.status(201).json({
      type: "success",
      message: "You have accepted group invitation",
      data: null,
    });

    const group = await db.group.findUnique({
      where: {
        id: groupId,
      },
      select: {
        name: true,
        admin: {
          select: {
            id: true,
            socketId: true,
          },
        },
      },
    });

    const payload = await createNotification({
      content: `has accepted your invitation to join group ${group.name}`,
      fromUserId: currentUser.id,
      toUserId: group.admin.id,
    });

    req.io.to(group.admin.socketId).emit("notification", payload);
  } catch (error) {
    next(error);
  }
};
