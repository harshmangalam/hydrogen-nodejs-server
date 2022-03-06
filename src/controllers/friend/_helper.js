const { db } = require("../../utils/db");

exports.fetchFriend = async (userId) => {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      socketId: true,
    },
  });

  return user;
};

exports.checkRequestReceived = async (currentUserId, userId) => {
  const user = await db.user.findUnique({
    where: {
      id: currentUserId,
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

  return user;
};

exports.checkAlreadyAccepted = async (currentUserId, userId) => {
  const user = await db.user.findUnique({
    where: {
      id: currentUserId,
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

  return user;
};

exports.createNotification = async ({ fromUserId, toUserId, content }) => {
  const notification = await db.notifications.create({
    data: {
      type: "FRIEND",
      fromUserId,
      toUserId,
      content,
    },
    include: {
      fromUser: {
        select: {
          id: true,
          firstName: true,
          profileImage: true,
        },
      },
    },
  });

  return notification;
};

exports.countNotifications = async (toUserId) => {
  const count = await db.notifications.count({
    where: {
      toUserId,
    },
  });

  return count;
};
exports.checkAlreadySent = async (currentUserId, userId) => {
  const user = await db.user.findUnique({
    where: {
      id: currentUserId,
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

  return user;
};

exports.checkAvailableInFriendsList = async (currentUserId, userId) => {
  const user = await db.user.findUnique({
    where: {
      id: currentUserId,
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
  return user;
};

exports.checkAvailableInSentList = async (currentUserId, userId) => {
  const user = await db.user.findUnique({
    where: {
      id: currentUserId,
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

  return user;
};

exports.checkAvailableInReceivedList = async (currentUserId, userId) => {
  const user = await db.user.findUnique({
    where: {
      id: currentUserId,
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

  return user;
};
