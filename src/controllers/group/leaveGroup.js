const { db } = require("../../utils/db");

exports.leaveGroup = async (req, res, next) => {
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
    });

    if (!isMember) {
      return next({
        status: 400,
        message: "Yoy are not the member of this group",
      });
    }

    await db.group.update({
      where: {
        id: groupId,
      },
      data: {
        members: {
          disconnect: {
            id: currentUser.id,
          },
        },
      },
    });
    return res.status(201).json({
      type: "success",
      message: "Group left successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
