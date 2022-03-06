const { db } = require("../../utils/db");
const { createNotification } = require("./_helper");
const { generateRandomImage } = require("../../utils/generateImage");
exports.createGroup = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const {
      name,
      coverImage,
      profileImage,
      privacy,
      invitedPeople = [],
    } = req.body;

    const group = await db.group.create({
      data: {
        name,
        coverImage:
          coverImage ||
          generateRandomImage({ str: name, size: 400, type: "blank" }),
        profileImage:
          profileImage || generateRandomImage({ str: name, size: 400 }),

        privacy,
        admin: {
          connect: {
            id: currentUser.id,
          },
        },
        invitedPeople: invitedPeople.length
          ? {
              connect: invitedPeople.map((id) => ({
                id,
              })),
            }
          : undefined,
      },
      select: {
        id: true,
        name: true,
      },
    });

    res.status(201).json({
      type: "success",
      message: "Group created successfully",
      data: {
        group,
      },
    });

    // send notification to all friend that user created a group
    const user = await db.user.findUnique({
      where: {
        id: currentUser.id,
      },
      select: {
        myFriends: {
          select: {
            id: true,
            socketId: true,
          },
        },
      },
    });

    for await (const friend of user.myFriends) {
      const payload = await createNotification({
        content: `has created a group ${group.name}`,
        fromUserId: currentUser.id,
        toUserId: friend.id,
      });

      req.io.to(friend.socketId).emit("notification", payload);
    }
  } catch (error) {
    next(error);
  }
};
