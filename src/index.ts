import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db";
import { setupBlogs } from "./blogs";
import { setupPosts } from "./posts";
import { setupTestingRoutes } from "./setupTestingRoutes";

dotenv.config();

const app = express();
app.use(express.json());

// 👉 ВАЖНО: подключаем тестовый маршрут
setupTestingRoutes(app);

// 👉 Подключаем остальные маршруты
setupBlogs(app);
setupPosts(app);

const start = async () => {
  await connectDB();
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
  });
};

start();
