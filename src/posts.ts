import { Express, Request, Response } from "express";
import { postValidationRules, handleInputErrors, basicAuthMiddleware } from "./middleware";
import { PostModel } from "./models/PostModel";
import { BlogModel } from "./models/BlogModel";

export const setupPosts = (app: Express) => {
  app.get("/blogs/:id/posts", async (req: Request, res: Response) => {
    const blogId = req.params.id;
    const posts = await PostModel.find({ blogId });

    const formatted = posts.map((post) => ({
      id: post._id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
    }));

    res.status(200).json({
      pagesCount: 1,
      page: 1,
      pageSize: formatted.length,
      totalCount: formatted.length,
      items: formatted,
    });
  });

  app.get("/posts", async (_req: Request, res: Response) => {
    const posts = await PostModel.find();
    res.status(200).json(
      posts.map((p) => ({
        id: p._id.toString(),
        title: p.title,
        shortDescription: p.shortDescription,
        content: p.content,
        blogId: p.blogId.toString(),
        blogName: p.blogName,
        createdAt: p.createdAt,
      })),
    );
  });

  app.get("/posts/:id", async (req: Request, res: Response) => {
    const post = await PostModel.findById(req.params.id);
    if (!post) return res.sendStatus(404);

    res.status(200).json({
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId.toString(),
      blogName: post.blogName,
      createdAt: post.createdAt,
    });
  });

  app.post(
    "/posts",
    basicAuthMiddleware,
    postValidationRules,
    handleInputErrors,
    async (req: Request, res: Response) => {
      const { title, shortDescription, content, blogId } = req.body;
      const blog = await BlogModel.findById(blogId);
      if (!blog) return res.status(400).send({ errorsMessages: [{ message: "Invalid blogId", field: "blogId" }] });

      const newPost = new PostModel({
        title,
        shortDescription,
        content,
        blogId,
        blogName: blog.name,
      });

      await newPost.save();

      res.status(201).json({
        id: newPost._id.toString(),
        title: newPost.title,
        shortDescription: newPost.shortDescription,
        content: newPost.content,
        blogId: newPost.blogId.toString(),
        blogName: newPost.blogName,
      });
    },
  );

  app.put(
    "/posts/:id",
    basicAuthMiddleware,
    postValidationRules,
    handleInputErrors,
    async (req: Request, res: Response) => {
      const { title, shortDescription, content, blogId } = req.body;
      const blog = await BlogModel.findById(blogId);
      if (!blog) return res.status(400).send({ errorsMessages: [{ message: "Invalid blogId", field: "blogId" }] });

      const updated = await PostModel.findByIdAndUpdate(
        req.params.id,
        {
          title,
          shortDescription,
          content,
          blogId,
          blogName: blog.name,
        },
        { new: true },
      );

      if (!updated) return res.sendStatus(404);
      res.sendStatus(204);
    },
  );

  app.delete("/posts/:id", basicAuthMiddleware, async (req: Request, res: Response) => {
    const deleted = await PostModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.sendStatus(404);
    res.sendStatus(204);
  });
};
