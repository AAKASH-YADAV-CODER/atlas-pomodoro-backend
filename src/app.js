import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "sowalnk.com",
      "www.sowalnk.com",
      "application-tier-ALB-52084640.ap-south-1.elb.amazonaws.com",
      "https://application-tier-ALB-52084640.ap-south-1.elb.amazonaws.com",
      "http://localhost:5174",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Credentials",
      "Access-Control-Allow-Origin",
    ],
  })
);

//Socket.io creating server and configure cors to allow origins.
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5174",
      "sowalnk.com",
      "www.sowalnk.com",
      "https://application-tier-ALB-52084640.ap-south-1.elb.amazonaws.com",
      "application-tier-ALB-52084640.ap-south-1.elb.amazonaws.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  },
});
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "16kbs" }));
app.use(express.static("public"));

//import Routes
import userAuth from "./routes/user.routes.js";
import pomodoroRouter from "./routes/pomodoro.routes.js";

//Route Declaration
app.use("/api/v1/user", userAuth);
app.use("/api/v1/pomodoro", pomodoroRouter);

//Socket.io
const activeUsers = new Map(); // userId -> socketId mapping

io.on("connection", (socket) => {
  socket.on("authenticate", (userId) => {
    activeUsers.set(userId, socket.id);
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    for (const [userId, socketId] of activeUsers.entries()) {
      if (socketId === socket.id) {
        activeUsers.delete(userId);
        console.log(`Disconnected with this ID ->${userId} disconnected`);
        break;
      }
    }
  });
});

export { app, server };

// http://localhost:5173
