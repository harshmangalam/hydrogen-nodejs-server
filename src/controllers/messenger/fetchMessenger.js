const { db } = require("../../utils/db");
exports.fetchMessenger = async (req, res, next) => {
  try {
    const currentUserId = res.locals.user.id;
    const messenger = await db.user.findUnique({
      where: {
        id: currentUserId,
      },
      select: {
        myFriends: {
          select: {
            id: true,
            firstName: true,
            profileImage: true,
            lastSeen: true,
            socketId:true,
            status: true,
            messagesReceived: {
              where: {
                senderId: currentUserId,
              },
              orderBy: {
                createdAt: "desc",
              },

              take: 1,
            },
            messagesSent: {
              where: {
                receiverId: currentUserId,
              },
              orderBy: {
                createdAt: "desc",
              },

              take: 1,
            },
          },
        },
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Fetch friends with last messages",
      data: {
        messengers: messenger.myFriends,
      },
    });
  } catch (error) {
    next(error);
  }
};
