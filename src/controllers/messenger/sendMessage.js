const { db } = require("../../utils/db");
exports.sendMessage = async (req, res, next) => {
  try {
    const currentUserId = res.locals.user.id;
    const friendId = req.params.friendId;
    const { content } = req.body;

    const message = await db.message.create({
      data: {
        senderId: currentUserId,
        receiverId: friendId,
        content,
        status: "SENT",
      },
      include: {
        receiver: {
          select: {
            id: true,
            firstName: true,
            profileImage: true,
          },
        },
        sender: {
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
      message: "Fetch friends with last messages",
      data: {
        message,
      },
    });
  } catch (error) {
    next(error);
  }
};
