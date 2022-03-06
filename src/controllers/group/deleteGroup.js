const { db } = require("../../utils/db");
const { createNotification } = require("./_helper");

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

    res.status(201).json({
      type: "success",
      message: "Group deleted successfully",
      data: null,
    });

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
      const payload = await createNotification({
        content: `has deleted a group ${groupData.name}`,
        fromUserId: currentUser.id,
        toUserId: user.id,
      });

      req.io.to(user.socketId).emit("notification", payload);
    }
    await db.group.delete({
      where: {
        id: groupId,
      },
    });
  } catch (error) {
    next(error);
  }
};
