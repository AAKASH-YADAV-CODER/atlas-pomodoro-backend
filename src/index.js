import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/index.js";
import { app, server } from "./app.js";
dotenv.config({ path: "./.env" });
app.use(express.json()); // Middleware to parse JSON body
connectDB()
  .then(() => {
    server.listen(process.env.PORT || 2000, () => {
      console.log(`Listening on port ${process.env.PORT || 2000}`);
    });
  })
  .catch((err) => {
    console.error("Error in database connection", err);
    process.exit(1);
  });
