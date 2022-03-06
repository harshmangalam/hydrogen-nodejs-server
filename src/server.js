require("dotenv").config();
const { createServer } = require("http");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { registerRoutes } = require("./routes");
const { ORIGIN, NODE_ENV, PORT } = require("./config/env.config");
const { createSocketIOInstance } = require("./socket");

const {
  globalErrorHandler,
  notFoundErrorHandler,
} = require("./middlewares/error.middleware");

const app = express();

const httpServer = createServer(app);

const io = createSocketIOInstance(httpServer);
// logging in development environment

if (NODE_ENV === "dev") {
  const morgan = require("morgan");
  app.use(morgan("dev"));
}

// parse incomming request into json
app.use(express.json());

// allow cors for frontend to access api routes
app.use(
  cors({
    credentials: true,
    origin: JSON.parse(ORIGIN),
    optionsSuccessStatus: 200,
  })
);

app.use(cookieParser()); // parse incomming cookies in request

app.use((req, res, next) => {
  req.io = io;
  next();
});
// server health check
app.get("/", (req, res) => {
  res.status(200).json({
    type: "success",
    message: "server is up and running",
    data: null,
  });
});

registerRoutes(app); // register routes
app.use("*", notFoundErrorHandler); // api route not found error handling
app.use(globalErrorHandler); //global error handler

httpServer.listen(PORT, () => console.log(`listening on port ${PORT}`));
