import express from 'express';
import { setupBlogs } from './blogs';
import { setupPosts } from './posts';
import { connectDB } from './db';
import dotenv from 'dotenv';
dotenv.config(); // Должно быть в самом верху, до использования process.env

const app = express();
app.use(express.json());

setupBlogs(app);
setupPosts(app);

app.get('/', (_req, res) => {
  res.send('🚀 API is running');
});

connectDB();

export default app;
