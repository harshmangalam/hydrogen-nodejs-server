const { db } = require("../../utils/db");
exports.clearAllMessages = async (req, res, next) => {
  try {
    const friendId = req.params.friendId;
    const currentUserId = res.locals.user.id;

    await db.message.deleteMany({
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
    });

    return res.status(200).json({
      type: "success",
      message: "clear messages between two user",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
