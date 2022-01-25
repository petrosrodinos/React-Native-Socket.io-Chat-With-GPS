const app = require("express")();
const http = require("http").Server(app);
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const HttpError = require("./models/http-error");
const mongoose = require("mongoose");
const { errorHandler } = require("./middleware/errorMiddleware");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const io = require("socket.io");

const rateLimmiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  headers: true,
  handler: function (req, res) {
    return res.json({
      message: "Too many login attemps,please try again later",
    });
  },
});

app.use(cors());

app.use(bodyParser.json());

app.use("/api/user", rateLimmiter, authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use((req, res, next) => {
  return res.json({ message: "Route doesnt exists" });
});

app.use(errorHandler);

PORT = process.env.PORT;

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    http.listen(PORT, () => {
      console.log("Listening...");
    });
  })
  .catch((error) => {
    error = new HttpError("Could not connect to database.", 404);
    throw error;
  });

const socket = io(http, {
  cors: {
    origin: process.env.IO_ORIGIN,
    methods: ["GET", "POST"],
  },
});

socket.on("connection", (socket) => {
  socket.on("gps-enabled", (user) => {
    console.log("gps connected");
    socket.join(user);
    socket.emit("connected");
  });

  socket.on("location", (location) => {
    socket.broadcast.emit("new-coords", location);
    console.log(location);
  });

  socket.on("leave", (user) => {
    console.log("USER DISCONNECTED");
    socket.leave(user);
  });

  socket.on("setup", (userData) => {
    socket.join(userData);
    socket.emit("connected");
    console.log("chat connected", userData);
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room); //2
  });
  socket.on("typing", (room) => socket.in(room).emit("typing")); //3
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing")); //4

  socket.on("new message", (newMessageRecieved) => {
    //console.log(newMessageRecieved);
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData);
  });
});
