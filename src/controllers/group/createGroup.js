const { db } = require("../../utils/db");
const {
  createNotification,
  countNotifications,
} = require("../../utils/notification");
const { generateRandomImage } = require("../../utils/generateImage");
const { fetchFriendsSocket } = require("../../utils/user");
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
    const user = await fetchFriendsSocket(currentUser.id);

    for await (const friend of user.myFriends) {
      const notification = await createNotification({
        content: `has created a group ${group.name}`,
        fromUserId: currentUser.id,
        toUserId: friend.id,
      });
      const count = await countNotifications(friend.id);
      req.io.to(friend.socketId).emit("notification", { notification, count });
    }
  } catch (error) {
    next(error);
  }
};
