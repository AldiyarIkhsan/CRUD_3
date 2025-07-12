import express from "express";
import { setupBlogs } from "./blogs";
import { setupPosts } from "./posts";
import { connectDB } from "./db";

const start = async () => {
  await connectDB();

  const app = express();
  app.use(express.json());

  setupBlogs(app);
  setupPosts(app);

  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
};

start();
