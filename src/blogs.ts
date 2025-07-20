import { Express, Request, Response } from "express";
import { blogValidationRules, handleInputErrors, basicAuthMiddleware } from "./middleware";
import { BlogModel } from "./models/BlogModel";

export const setupBlogs = (app: Express) => {
  app.get("/blogs", async (_req: Request, res: Response) => {
    const blogs = await BlogModel.find();
    res.status(200).json(
      blogs.map((b) => ({
        id: b._id.toString(),
        name: b.name,
        description: b.description,
        websiteUrl: b.websiteUrl,
        isMembership: false,
        createdAt: b.createdAt,
      })),
    );
  });

  app.get("/blogs/:id", async (req: Request, res: Response) => {
    const blog = await BlogModel.findById(req.params.id);
    if (!blog) return res.sendStatus(404);
    res.status(200).json({
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      isMembership: false,
      createdAt: blog.createdAt,
    });
  });

  app.post(
    "/blogs",
    basicAuthMiddleware,
    blogValidationRules,
    handleInputErrors,
    async (req: Request, res: Response) => {
      const { name, description, websiteUrl } = req.body;
      const blog = new BlogModel({ name, description, websiteUrl });
      await blog.save();
      res.status(201).json({
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        isMembership: false,
        createdAt: blog.createdAt,
      });
    },
  );

  app.put(
    "/blogs/:id",
    basicAuthMiddleware,
    blogValidationRules,
    handleInputErrors,
    async (req: Request, res: Response) => {
      const updated = await BlogModel.findByIdAndUpdate(req.params.id, req.body);
      if (!updated) return res.sendStatus(404);
      res.sendStatus(204);
    },
  );

  app.delete("/blogs/:id", basicAuthMiddleware, async (req: Request, res: Response) => {
    const deleted = await BlogModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.sendStatus(404);
    res.sendStatus(204);
  });
};
