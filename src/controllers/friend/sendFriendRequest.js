const {
  fetchFriend,
  checkAlreadySent,
  createNotification,
  countNotifications,
} = require("./_helper");

const { db } = require("../../utils/db");

exports.sendFriendRequest = async (req, res, next) => {
  const currentUser = res.locals.user;
  const userId = req.params.userId;
  try {
    // check if  user exists
    const toUser = await fetchFriend(userId);

    if (!toUser) {
      return next({ status: 404, message: "User not found" });
    }

    // check if already  friend request sent

    const user = await checkAlreadySent(currentUser.id, userId);
    if (user.friendsRequestsSent.length) {
      return next({ status: 400, message: "Friend request already sent" });
    }

    await db.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        friendsRequestsSent: {
          connect: {
            id: userId,
          },
        },
      },
    });

    res.status(200).json({
      type: "success",
      message: "Friend request sent",
      data: null,
    });

    const notification = await createNotification({
      fromUserId: currentUser.id,
      toUserId: userId,
      content: "has sent you friend request",
    });

    const count = await countNotifications(toUser.id);

    req.io.to(toUser.socketId).emit("notification", { notification, count });
  } catch (error) {
    next(error);
  }
};
