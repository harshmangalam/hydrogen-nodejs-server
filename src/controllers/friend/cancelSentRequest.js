const {
  fetchFriend,
  checkAvailableInSentList,
  createNotification,
  countNotifications,
} = require("./_helper");
const { db } = require("../../utils/db");

exports.cancelSentRequest = async (req, res, next) => {
  const currentUser = res.locals.user;
  const userId = req.params.userId;
  try {
    // check if  user exists
    const toUser = await fetchFriend(userId);

    if (!toUser) {
      return next({ status: 404, message: "User not found" });
    }

    // check if available in sent list
    const user = await checkAvailableInSentList(currentUser.id, userId);
    if (!user.friendsRequestsSent.length) {
      return next({ status: 400, message: "You have not sent friend request" });
    }

    // remove from sent lists

    await db.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        friendsRequestsSent: {
          disconnect: {
            id: userId,
          },
        },
      },
    });

    // remove from received list from opposite side
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        friendsRequestsReceived: {
          disconnect: {
            id: currentUser.id,
          },
        },
      },
    });

    res.status(200).json({
      type: "success",
      message: "Friend request cancelled",
      data: null,
    });

    const notification = await createNotification({
      fromUserId: currentUser.id,
      toUserId: userId,
      content: "has cancelled your friend request",
    });

    const count = await countNotifications(toUser.id);

    req.io.to(toUser.socketId).emit("notification", { notification, count });
  } catch (error) {
    next(error);
  }
};
