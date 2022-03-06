const {
  fetchFriend,
  checkAvailableInFriendsList,
  createNotification,
  countNotifications,
} = require("./_helper");

const { db } = require("../../utils/db");

exports.removeFromFriendslist = async (req, res, next) => {
  const currentUser = res.locals.user;
  const userId = req.params.userId;
  try {
    // check if  user exists
    const toUser = await fetchFriend(userId);

    if (!toUser) {
      return next({ status: 404, message: "User not found" });
    }

    // check if available in friends lists
    const user = await checkAvailableInFriendsList(currentUser.id, userId);

    if (!user.myFriends.length) {
      return next({ status: 400, message: "Both of you are not friends" });
    }

    // remove from friends lists

    await db.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        myFriends: {
          disconnect: {
            id: userId,
          },
        },
        friendsOf: {
          disconnect: {
            id: userId,
          },
        },
      },
    });

    // remove from opposite site friend list

    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        myFriends: {
          disconnect: {
            id: currentUser.id,
          },
        },
        friendsOf: {
          disconnect: {
            id: currentUser.id,
          },
        },
      },
    });

    res.status(200).json({
      type: "success",
      message: "Both of you are not friends from now",
      data: null,
    });

    const notification = await createNotification({
      fromUserId: currentUser.id,
      toUserId: userId,
      content: "has unfriend you",
    });

    const count = await countNotifications(toUser.id);

    req.io.to(toUser.socketId).emit("notification", { notification, count });
  } catch (error) {
    next(error);
  }
};
