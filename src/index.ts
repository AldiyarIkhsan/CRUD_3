import express from "express";
import { setupBlogs } from "./blogs";
import { setupPosts } from "./posts";
import { connectDB } from "./db";

const app = express();
app.use(express.json());

// Подключение к БД при первом запросе (лениво)
let dbConnected = false;
app.use(async (req, res, next) => {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
  next();
});

// Подключение маршрутов
setupBlogs(app);
setupPosts(app);

// Корневой маршрут (для проверки работоспособности)
app.get("/", (_req, res) => {
  res.send("🚀 API is running");
});

export default app;
