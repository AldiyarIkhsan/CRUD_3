import express from "express";
import { setupBlogs } from "./blogs";
import { setupPosts } from "./posts";
import { connectDB } from "./db";

// Создаем app один раз
const app = express();
app.use(express.json());

// Подключаем маршруты
setupBlogs(app);
setupPosts(app);

// Подключение к БД при первом запросе (лениво)
let dbConnected = false;
app.use(async (req, res, next) => {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
  next();
});

// Экспортируем как серверless handler для Vercel
export default app;
