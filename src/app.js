import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import { DailyTask } from "./models/daily.model.js";

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "sowalnk.com",
      "www.sowalnk.com",
      "application-tier-ALB-52084640.ap-south-1.elb.amazonaws.com",
      "https://application-tier-ALB-52084640.ap-south-1.elb.amazonaws.com",
      "http://localhost:5173",
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
      "http://localhost:5173",
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
import dailyTaskRouter from "./routers/daily.routes.js";
import userAuth from "./routers/user.routes.js";
import weeklyTaskRouter from "./routers/weekly.routes.js";
import monthlyTaskRouter from "./routers/monthly.routes.js";
import yearlyTaskRouter from "./routers/yearly.routes.js";
import subscriptionRouter from "./routers/subscription.routes.js";
import pomodoroRouter from "./routers/15TimesMethodRoutes/pomodoro.routes.js";

//Route Declaration
app.use("/api/v1/task", dailyTaskRouter);
app.use("/api/v1/user", userAuth);
app.use("/api/v1/weeklytask", weeklyTaskRouter);
app.use("/api/v1/monthlytask", monthlyTaskRouter);
app.use("/api/v1/yearlytask", yearlyTaskRouter);
app.use("/api/v1/subscription", subscriptionRouter);
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

// Function to check for tasks ending soon
async function checkEndingTasks() {
  try {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Iterate through all connected users
    for (const [userId, socketId] of activeUsers.entries()) {
      try {
        // Fetch tasks only for this specific user
        const tasks = await DailyTask.find({
          user: userId, // Filter by the authenticated user's ID
          isCompleted: false,
          hasExceededTime: false,
          isRead: false, // Only unread notifications
          notified: false,
        });

        tasks.forEach((task) => {
          if (!task.endTime) return;

          const [hours, minutes] = task.endTime.split(":").map(Number);
          const taskMinutes = hours * 60 + minutes;
          const timeDiff = taskMinutes - currentMinutes;

          if (timeDiff <= 5 && timeDiff >= 0) {
            // Send notification to this specific user
            io.to(socketId).emit("task-ending-soon", {
              taskId: task._id,
              title: task.taskName,
              endTime: task.endTime,
              minutesRemaining: timeDiff,
            });
            task.notified = true;
            task.save();
          }
        });
      } catch (error) {
        console.error(`Error processing tasks for user ${userId}:`, error);
      }
    }
  } catch (error) {
    console.error("Error in checkEndingTasks:", error);
  }
}

// Check every minute
setInterval(checkEndingTasks, 30000);

export { app, server };

// http://localhost:5173
