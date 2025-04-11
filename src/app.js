import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { verifyJWT } from "./middlerwares/auth.middleware.js";
const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
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

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "16kbs" }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("hii");
});

//import Routes
import userAuth from "./routes/user.routes.js";
import pomodoroRouter from "./routes/pomodoro.routes.js";

//Route Declaration
app.use("/api/v1/user", userAuth);
app.use("/api/v1/pomodoro", pomodoroRouter);

//For checking the token expired or not
app.get("/api/v1/check-auth", verifyJWT, async (req, res) => {
  res.status(200).json({ message: "Valid Token" });
});

export { app };

// http://localhost:5173
