const { db } = require("../../utils/db");
const {
  createNotification,
  countNotifications,
} = require("../../utils/notification");
const { generateRandomImage } = require("../../utils/generateImage");
const { fetchFriendsSocket, fetchUserSocket } = require("../../utils/user");
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
    if (privacy === "PUBLIC") {
      console.log("public");
      const user = await fetchFriendsSocket(currentUser.id);

      for await (const friend of user.myFriends) {
        const notification = await createNotification({
          content: `has created a public group ${group.name}`,
          fromUserId: currentUser.id,
          toUserId: friend.id,
          type: "GROUP",
        });
        const count = await countNotifications(friend.id);
        req.io
          .to(friend.socketId)
          .emit("notification", { notification, count });
      }
    }

    if (privacy === "PRIVATE") {
      {
        console.log("private");

        for await (const userId of invitedPeople) {
          const friend = await fetchUserSocket(userId);
          const notification = await createNotification({
            content: `has created a private group ${group.name}`,
            fromUserId: currentUser.id,
            toUserId: friend.id,
            type: "GROUP",
          });
          const count = await countNotifications(friend.id);
          req.io
            .to(friend.socketId)
            .emit("notification", { notification, count });
        }
      }
    }
  } catch (error) {
    next(error);
  }
};
