const { db } = require("./db");

exports.fetchFriendsSocket = async (userId) => {
  return await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      myFriends: {
        select: {
          id: true,
          socketId: true,
        },
      },
    },
  });
};
