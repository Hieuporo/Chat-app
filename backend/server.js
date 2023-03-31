const express = require("express");
const morgan = require("morgan");
require("express-async-errors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./db/connect");
const cookieParser = require("cookie-parser");
const { notFoundMiddleware } = require("./middlewares/not-found");
const { errorHandlerMiddleware } = require("./middlewares/error-handler");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const friendRoutes = require("./routes/friendRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { newMessage } = require("./controllers/messageControler");

const app = express();
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/friend", friendRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/message", messageRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

connectDB();

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.data.userId = userData._id;
    socket.join(userData._id);
    socket.emit("connected");
  });

  const interval = setInterval(() => {
    if (socket.data.userId) {
      const userId = socket.data.userId;
      console.log(`userId : ${userId}`);
      io.emit("isOnline", userId);
    }
  }, 1000);

  socket.on("disconnect", () => {
    const userId = socket.data.userId;
    io.emit("userDisconnected", userId);
    clearInterval(interval);
  });

  socket.on("joinRoom", (room) => {
    socket.join(room);
  });

  socket.on("sendNewMessage", (newMessage) => {
    newMessage.chat.users.map((user) => {
      if (user._id == newMessage.sender._id) return;
      socket.in(user._id).emit("newMessage", newMessage);
    });
  });

  socket.on("addUser", (id) => {
    socket.in(id).emit("fetchChats");
  });

  socket.on("removeUser", (id) => {
    socket.in(id).emit("fetchChats");
  });

  socket.on("fetchFriend", (id) => {
    socket.in(id).emit("fetchFriendList");
  });

  socket.on("fetchRequests", (id) => {
    socket.in(id).emit("fetchRequestList");
  });

  socket.on("fetchInvites", (id) => {
    socket.in(id).emit("fetchInviteList");
  });
});
