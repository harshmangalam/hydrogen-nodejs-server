const { db } = require("../utils/db");

module.exports = (io, socket) => {
  socket.on("chat:message-status", async (payload) => {
    console.log(payload);
    const { toSocketId, messageId, status } = payload;

    await db.message.update({
      where: {
        id: messageId,
      },
      data: {
        status,
      },
    });

    io.to(toSocketId).emit("chat:message-status", payload);
  });
};
