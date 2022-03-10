const { db } = require("../utils/db");

module.exports = (io, socket) => {
  socket.on("chat:message-status", async (payload) => {
    const { toSocketId, data } = payload;

    await db.message.update({
      where: {
        id: data.messageId,
      },
      data: {
        status: data.status,
      },
    });

    io.to(toSocketId).emit("chat:message-status", payload);
  });
};
