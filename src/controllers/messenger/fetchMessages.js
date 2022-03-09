const { db } = require("../../utils/db");
exports.fetchMessages = async (req, res, next) => {
  try {
    const friendId = req.params.friendId;
    const currentUserId = res.locals.user.id;

    const friend = await db.user.findUnique({
      where: { id: friendId },
      select: {
        id: true,
        firstName: true,
        profileImage: true,
        status: true,
        lastSeen: true,
      },
    });
    const messages = await db.message.findMany({
      where: {
        OR: [
          {
            AND: [
              {
                senderId: currentUserId,
              },
              {
                receiverId: friendId,
              },
            ],
          },
          {
            AND: [
              {
                receiverId: currentUserId,
              },
              {
                senderId: friendId,
              },
            ],
          },
        ],
      },
      include: {
        receiver: {
          select: {
            id: true,
            firstName: true,
            profileImage: true,
            socketId:true,
          },
        },
        sender: {
          select: {
            id: true,
            firstName: true,
            profileImage: true,
            socketId:true,

          },
        },
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Fetch messages between two user",
      data: {
        messages,
        friend,
      },
    });
  } catch (error) {
    next(error);
  }
};
