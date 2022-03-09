const { db } = require("../../utils/db");
// fetch friends suggestion

const select = {
  id: true,
  firstName: true,
  lastName: true,
  profileImage: true,
  status: true,
  lastSeen:true,
  myFriends: {
    take: 3,
    select: {
      id: true,
      profileImage: true,
      firstName: true,
    },
  },
  _count: {
    select: {
      myFriends: true,
    },
  },
};

exports.fetchFriendsSuggestion = async (req, res, next) => {
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
          {
            friendsRequestsSent: {
              some: {
                id: currentUser.id,
              },
            },
          },
          {
            myFriends: {
              some: {
                id: currentUser.id,
              },
            },
          },
        ],
      },
      select,
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

exports.fetchFriends = async (req, res, next) => {
  const currentUser = res.locals.user;

  try {
    const user = await db.user.findUnique({
      where: {
        id: currentUser.id,
      },
      select: {
        myFriends: {
          select,
        },
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Fetch my friends",
      data: {
        users: user.myFriends,
      },
    });
  } catch (error) {
    next(error);
  }
};

// fetch friends requests sent
exports.fetchFriendsRequestsSent = async (req, res, next) => {
  const currentUser = res.locals.user;

  try {
    const user = await db.user.findUnique({
      where: {
        id: currentUser.id,
      },
      select: {
        friendsRequestsSent: {
          select,
        },
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Fetch friends requests sent",
      data: {
        users: user.friendsRequestsSent,
      },
    });
  } catch (error) {
    next(error);
  }
};

// fetch friends requests received

exports.fetchFriendsRequestsReceived = async (req, res, next) => {
  const currentUser = res.locals.user;

  try {
    const user = await db.user.findUnique({
      where: {
        id: currentUser.id,
      },
      select: {
        friendsRequestsReceived: {
          select,
        },
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Fetch friends requests received",
      data: {
        users: user.friendsRequestsReceived,
      },
    });
  } catch (error) {
    next(error);
  }
};