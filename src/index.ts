// src/index.js
import express from "express";
import { setupBlogs } from "./blogs";
import { setupPosts } from "./posts";
import { connectDB } from "./db";

const app = express();
app.use(express.json());

let dbConnected = false;
app.use(async (_req, _res, next) => {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
  next();
});

setupBlogs(app);
setupPosts(app);

app.get("/", (_req, res) => {
  res.send("🚀 API is running");
});

module.exports = app;