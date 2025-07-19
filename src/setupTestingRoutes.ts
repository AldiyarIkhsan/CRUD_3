// In setupTestingRoutes.ts
import { Express, Request, Response } from "express";
import { BlogModel } from "./models/BlogModel";
import { PostModel } from "./models/PostModel";

// В setupTestingRoutes.ts
export const setupTestingRoutes = (app: Express) => {
  // 👇 добавь вот это
  app.delete("testing/all-data", (req, res) => {
    res.redirect(307, "/testing/all-data"); // сохраняет метод DELETE
  });

  // 👇 основной рабочий маршрут
  app.delete("/testing/all-data", async (_req, res) => {
    try {
      await Promise.all([BlogModel.deleteMany({}), PostModel.deleteMany({})]);
      res.sendStatus(204);
    } catch (error) {
      console.error("Error clearing data:", error);
      res.sendStatus(500);
    }
  });
};
