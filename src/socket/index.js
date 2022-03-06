const { ORIGIN } = require("../config/env.config");
const { Server } = require("socket.io");
const { db } = require("../utils/db");
exports.createSocketIOInstance = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: JSON.parse(ORIGIN),
    },
  });

  io.use(async (socket, next) => {
    if (!socket.handshake.auth?.userId) {
      const error = new Error();
      error.message = "Unauthenticated";
      next(error);
    }

    await db.user.update({
      where: {
        id: socket.handshake.auth.userId,
      },
      data: {
        socketId: socket.id,
      },
    });
    next();
  });

  const handleConnection = (socket) => {
    // friendHandler(io, socket);
  };
  io.on("connection", handleConnection);

  return io;
};
