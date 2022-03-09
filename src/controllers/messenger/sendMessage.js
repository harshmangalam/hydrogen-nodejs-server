const { db } = require("../../utils/db");
exports.sendMessage = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const friendId = req.params.friendId;
    const { content } = req.body;

    const friend = await db.user.findUnique({
      where: {
        id: friendId,
      },
      select: {
        id: true,
        socketId: true,
      },
    });
    const message = await db.message.create({
      data: {
        senderId: currentUser.id,
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
            status: true,
            lastSeen: true,
            socketId:true
          },
        },
        sender: {
          select: {
            id: true,
            firstName: true,
            profileImage: true,
            status: true,
            lastSeen: true,
            socketId:true,
          },
        },
      },
    });

    req.io.to(friend.socketId).emit("chat:message-received", message);
 
    res.status(200).json({
      type: "success",
      message: "Message sent successfully",
      data: {
        message,
      },
    });
  } catch (error) {
    next(error);
  }
};
