const { db } = require("../../utils/db");
const { createNotification } = require("./_helper");

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
      },
    });

    for await (const user of group.members) {
      const payload = await createNotification({
        content: `has created a group post in group ${group.name}`,
        fromUserId: currentUser.id,
        toUserId: user.id,
      });

      req.io.to(user.socketId).emit("notification", payload);
    }
  } catch (error) {
    next(error);
  }
};
