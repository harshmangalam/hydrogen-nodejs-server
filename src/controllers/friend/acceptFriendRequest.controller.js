const { db } = require("../../utils/db");
const {
  fetchFriend,
  checkRequestReceived,
  checkAlreadyAccepted,
  createNotification,
  countNotifications,
} = require("./_helper");

exports.acceptFriendRequest = async (req, res, next) => {
  const currentUser = res.locals.user;
  const userId = req.params.userId;
  try {
    // check if  user exists
    const toUser = await fetchFriend(userId);

    if (!toUser) {
      return next({ status: 404, message: "User not found" });
    }

    // check if request received
    const requestReceived = await checkRequestReceived(currentUser.id, userId);

    if (!requestReceived.friendsRequestsReceived.length) {
      return next({ status: 400, message: "Friend request not received" });
    }

    // check if already  accepted
    const user = await checkAlreadyAccepted(currentUser.id, userId);
    if (user.myFriends.length) {
      return next({ status: 400, message: "Both of you are already friends" });
    }

    // add to my friends lists and remove from received requests lists

    await db.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        myFriends: {
          connect: {
            id: userId,
          },
        },
        friendsOf: {
          connect: {
            id: userId,
          },
        },
        friendsRequestsReceived: {
          disconnect: {
            id: userId,
          },
        },
      },
    });

    // add to opposite user friends lists and remove from sent requests lists
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        myFriends: {
          connect: {
            id: currentUser.id,
          },
        },
        friendsOf: {
          connect: {
            id: currentUser.id,
          },
        },
        friendsRequestsSent: {
          disconnect: {
            id: currentUser.id,
          },
        },
      },
    });

    res.status(200).json({
      type: "success",
      message: "Both of you are now friends",
      data: null,
    });

    const notification = await createNotification({
      content: "has accepted your friend request",
      fromUserId: currentUser.id,
      toUserId: userId,
    });
    const count = await countNotifications(toUser.id);
    req.io.to(toUser.socketId).emit("notification", { notification, count });
  } catch (error) {
    next(error);
  }
};
