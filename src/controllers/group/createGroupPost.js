const { db } = require("../../utils/db");
const {
  createNotification,
  countNotifications,
} = require("../../utils/notification");

exports.createGroupPost = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const { content, image, groupId } = req.body;
    const post = await db.groupPost.create({
      data: {
        content,
        image,
        author: {
          connect: {
            id: currentUser.id,
          },
        },
        group: {
          connect: {
            id: groupId,
          },
        },
      },
    });

    res.status(200).json({
      type: "success",
      message: "Group post created successfully.",
      data: {
        post,
      },
    });

    const group = await db.group.findUnique({
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
        admin: {
          select: {
            id: true,
            socketId: true,
          },
        },
      },
    });

    for await (const user of group.members) {
      const notification = await createNotification({
        content: `has created a group post in group ${group.name}`,
        fromUserId: currentUser.id,
        toUserId: user.id,
        type: "POST",
      });
      const count = await countNotifications(user.id);

      req.io.to(user.socketId).emit("notification", { notification, count });
    }
    const notification = await createNotification({
      content: `has created a group post in group ${group.name}`,
      fromUserId: currentUser.id,
      toUserId: group.admin.id,
      type: "POST",
    });
    const count = await countNotifications(group.admin.id);

    req.io.to(group.admin.socketId).emit("notification", { notification, count });
  } catch (error) {
    next(error);
  }
};
