import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
const app = express();

//The configuration for all data manipulation.
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kbs" }));
app.use(express.static("public"));
app.use(cookieParser());
dotenv.config({
  path: "./.env",
});
app.use(
  cors({
    origin: ["http://localhost:5174", "http://192.168.208.81:5173", "*"],
  })
);

//All Routes
app.get("/", (req, res) => {
  res.send("hii how are you");
});

export { app };
