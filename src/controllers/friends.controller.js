const { db } = require("../utils/db");

// fetch friends suggestion

const fetchFriendsSuggestion = async (req, res, next) => {
  const currentUser = res.locals.user;

  try {
    const users = await db.user.findMany({
      where: {
        NOT: [
          {
            friendsRequestsReceived: {
              some: {
                id: currentUser.id,
              },
            },
          },
          {
            id: currentUser.id,
          },
        ],
      },
      select: {
        id: true,
        firstName: true,
        profileImage: true,
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Fetch friends suggestions",
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

// fetch my friends

const fetchFriends = async (req, res, next) => {
  const currentUser = res.locals.user;

  try {
    const users = await db.user.findUnique({
      where: {
        id: currentUser.id,
      },
      select: {
        myFriends: {
          select: {
            id: true,
            firstName: true,
            profileImage: true,
          },
        },
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Fetch friends suggestions",
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

// fetch friends requests sent
const fetchFriendsRequestsSent = async (req, res, next) => {
  const currentUser = res.locals.user;

  try {
    const users = await db.user.findUnique({
      where: {
        id: currentUser.id,
      },
      select: {
        friendsRequestsSent: {
          select: {
            id: true,
            firstName: true,
            profileImage: true,
          },
        },
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Fetch friends requests sent",
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

// fetch friends requests received

const fetchFriendsRequestsReceived = async (req, res, next) => {
  const currentUser = res.locals.user;

  try {
    const users = await db.user.findUnique({
      where: {
        id: currentUser.id,
      },
      select: {
        friendsRequestsReceived: {
          select: {
            id: true,
            firstName: true,
            profileImage: true,
          },
        },
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Fetch friends requests received",
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

// send friend requests
const sendFriendRequest = async (req, res, next) => {
  const currentUser = res.locals.user;
  const userId = req.params.userId;
  try {
    // check if already  friend request sent

    const user = await db.user.findUnique({
      where: {
        id: currentUser.id,
      },
      select: {
        friendsRequestsSent: {
          where: {
            id: userId,
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (user.friendsRequestsSent.length) {
      return next({ status: 400, message: "Friend request already sent" });
    }

    const sentRequestToUser = await db.user.update({
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
      select: {
        friendsRequestsSent: {
          select: {
            id: true,
            firstName: true,
            profileImage: true,
          },
        },
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Friend request sent",
      data: {
        user: sentRequestToUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

// accept friend requests

const acceptFriendRequest = async (req, res, next) => {
  const currentUser = res.locals.user;
  const userId = req.params.userId;
  try {
    //   check if request received
    const requestReceived = await db.user.findUnique({
      where: {
        id: currentUser.id,
      },
      select: {
        friendsRequestsReceived: {
          where: {
            id: userId,
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (!requestReceived.friendsRequestsReceived.length) {
      return next({ status: 400, message: "Friend request not received" });
    }

    // check if already  accepted
    const user = await db.user.findUnique({
      where: {
        id: currentUser.id,
      },
      select: {
        myFriends: {
          where: {
            id: userId,
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (user.myFriends.length) {
      return next({ status: 400, message: "Both of you are already friends" });
    }

    // add to my friends lists and remove from received requests lists

    const myFriends = await db.user.update({
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
      select: {
        myFriends: {
          select: {
            id: true,
            profileImage: true,
            firstName: true,
          },
        },
      },
    });

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
      select: {
        id: true,
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Both of you are now friends",
      data: {
        user: myFriends,
      },
    });
  } catch (error) {
    next(error);
  }
};

const removeFromFriendslist = async (req, res, next) => {
  const currentUser = res.locals.user;
  const userId = req.params.userId;
  try {
    // check if available in friends lists
    const user = await db.user.findUnique({
      where: {
        id: currentUser.id,
      },
      select: {
        myFriends: {
          where: {
            id: userId,
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (!user.myFriends.length) {
      return next({ status: 400, message: "Both of you are not friends" });
    }

    // remove from friends lists

    const myFriends = await db.user.update({
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
      select: {
        myFriends: {
          select: {
            id: true,
            firstName: true,
            profileImage: true,
          },
        },
      },
    });

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

    return res.status(200).json({
      type: "success",
      message: "Both of you are not friends from now",
      data: {
        user: myFriends,
      },
    });
  } catch (error) {
    next(error);
  }
};

// remove sent requests 
const cancelSentRequest = async (req, res, next) => {
  const currentUser = res.locals.user;
  const userId = req.params.userId;
  try {
    // check if available in sent list
    const user = await db.user.findUnique({
      where: {
        id: currentUser.id,
      },
      select: {
        friendsRequestsSent: {
          where: {
            id: userId,
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (!user.friendsRequestsSent.length) {
      return next({ status: 400, message: "You have not sent friend request" });
    }

    // remove from sent lists

    const myFriends = await db.user.update({
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
      select: {
        myFriends: {
          select: {
            id: true,
            firstName: true,
            profileImage: true,
          },
        },
      },
    });

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

    return res.status(200).json({
      type: "success",
      message: "Friend request cancelled",
      data: {
        user: myFriends,
      },
    });
  } catch (error) {
    next(error);
  }
};


// ignore received requests

const ignoreReceivedRequest = async (req, res, next) => {
  const currentUser = res.locals.user;
  const userId = req.params.userId;
  try {
    // check if available in received list
    const user = await db.user.findUnique({
      where: {
        id: currentUser.id,
      },
      select: {
        friendsRequestsReceived: {
          where: {
            id: userId,
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (!user.friendsRequestsReceived.length) {
      return next({ status: 400, message: "You have not received friend request" });
    }

    // remove from sent lists

    const myFriends = await db.user.update({
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
      select: {
        myFriends: {
          select: {
            id: true,
            firstName: true,
            profileImage: true,
          },
        },
      },
    });

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

    return res.status(200).json({
      type: "success",
      message: "Friend request ignored successfully",
      data: {
        user: myFriends,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  fetchFriendsRequestsSent,
  fetchFriendsRequestsReceived,
  sendFriendRequest,
  acceptFriendRequest,
  removeFromFriendslist,
  fetchFriendsSuggestion,
  fetchFriends,
  cancelSentRequest,
  ignoreReceivedRequest
};
