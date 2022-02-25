const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const { PORT, ORIGIN, NODE_ENV } = require("./config/env.config");
const app = express();
const http = require("http").createServer(app);

// import all routes
const authRoutes = require("./routes/auth.route");
const postRoutes = require("./routes/post.route");
const friendsRoutes = require("./routes/friends.route");
const groupsRoutes = require("./routes/group.route");

// middlewares

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

// parse incomming cookies in request
app.use(cookieParser());

// logging in development environment

if (NODE_ENV === "dev") {
  const morgan = require("morgan");
  app.use(morgan("dev"));
}

// server health check

app.get("/", (req, res) => {
  res.status(200).json({
    type: "success",
    message: "server is up and running",
    data: null,
  });
});

// routes middleware
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/groups", groupsRoutes);

// page not found error handling  middleware

app.use("*", (req, res, next) => {
  const error = {
    status: 404,
    message: "API endpoint does not exists",
  };
  next(error);
});

// global error handling middleware
app.use((err, req, res, next) => {
  console.log(err);
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  const data = err.data || null;
  res.status(status).json({
    type: "error",
    message,
    data,
  });
});

function main() {
  try {
    http.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

main();
