const {
  checkAvailableInReceivedList,
  createNotification,
  countNotifications,
  fetchFriend,
} = require("./_helper");

const { db } = require("../../utils/db");
exports.ignoreReceivedRequest = async (req, res, next) => {
  const currentUser = res.locals.user;
  const userId = req.params.userId;
  try {
    // check if  user exists
    const toUser = await fetchFriend(userId);

    if (!toUser) {
      return next({ status: 404, message: "User not found" });
    }
    // check if available in received list
    const user = await checkAvailableInReceivedList(currentUser.id, userId);
    if (!user.friendsRequestsReceived.length) {
      return next({
        status: 400,
        message: "You have not received friend request",
      });
    }

    // remove from current user received lists

    await db.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        friendsRequestsReceived: {
          disconnect: {
            id: userId,
          },
        },
      },
    });
    // remove from other user sent lists

    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        friendsRequestsSent: {
          disconnect: {
            id: currentUser.id,
          },
        },
      },
    });

    res.status(200).json({
      type: "success",
      message: "Friend request ignored successfully",
      data: null,
    });

    const notification = await createNotification({
      fromUserId: currentUser.id,
      toUserId: userId,
      content: "has ignore your friend request",
      
    });
    const count = await countNotifications(toUser.id);

    req.io.to(toUser.socketId).emit("notification", { notification, count });
  } catch (error) {
    next(error);
  }
};
