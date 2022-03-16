const { db } = require("../../utils/db");
const {
  countNotifications,
  createNotification,
} = require("../../utils/notification");
const { fetchFriendsSocket } = require("../../utils/user");
exports.createPost = async (req, res, next) => {
  const currentUser = res.locals.user;
  const {
    content,
    audience,
    specificAudienceFriends = [],
    image,
    feeling,
    checkIn,
    taggedFriends = [],
  } = req.body;
  try {
    const post = await db.post.create({
      data: {
        content,
        image,
        feeling,
        checkIn,
        audience,
        author: {
          connect: {
            id: currentUser.id,
          },
        },
        taggedFriends: taggedFriends?.length
          ? {
              connect: taggedFriends.map((id) => ({
                id,
              })),
            }
          : undefined,
        specificAudienceFriends: specificAudienceFriends?.length
          ? {
              connect: specificAudienceFriends.map((id) => ({
                id,
              })),
            }
          : undefined,
      },
    });

    res.status(200).json({
      type: "success",
      message: "Post created successfully",
      data: {
        post,
      },
    });

    const user = await fetchFriendsSocket(currentUser.id);

    for await (const friend of user.myFriends) {
      const notification = await createNotification({
        content: `has added new post`,
        fromUserId: currentUser.id,
        toUserId: friend.id,
        type: "POST",
      });

      const count = await countNotifications(friend.id);
      req.io.to(friend.socketId).emit("notification", { notification, count });
    }
  } catch (error) {
    next(error);
  }
};
