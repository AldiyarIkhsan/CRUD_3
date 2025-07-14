import express from 'express';
import { setupBlogs } from './blogs';
import { setupPosts } from './posts';
import { connectDB } from './db';
import dotenv from 'dotenv';
import { setupTestingRoutes } from './setupTestingRoutes';

dotenv.config(); 

const app = express();
app.use(express.json());

setupBlogs(app);
setupPosts(app);
setupTestingRoutes(app); 

app.get('/', (_req, res) => {
  res.send('🚀 API is running');
});

// ✅ Оборачиваем запуск сервера в async-функцию
const start = async () => {
  try {
    console.log("📦 MONGO_URI from env:", process.env.MONGO_URI); // логируем переменную
    await connectDB();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

start();

export default app;
