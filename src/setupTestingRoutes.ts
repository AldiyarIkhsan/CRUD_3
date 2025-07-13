import { Express, Request, Response } from "express";
import { clearBlogs, clearPosts } from "./testing";

export const setupTestingRoutes = (app: Express) => {
  app.delete("/testing/all-data", async (_req: Request, res: Response) => {
    await clearBlogs();
    await clearPosts();
    res.sendStatus(204);
  });
};
