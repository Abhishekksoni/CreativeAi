import { Request, Response } from "express";
import { PostService } from "../service/postService";


declare global {
  namespace Express {
    interface User {
      id: string;
      [key: string]: any;
    }
  }
}

export class PostController {
  static async createPost(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const post = await PostService.createPost(req.user.id, req.body);
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  static async getAllPosts(req: Request, res: Response): Promise<void> {
    try {
      const posts = await PostService.getAllPosts();
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  static async getPostById(req: Request, res: Response): Promise<void> {
    try {
      const post = await PostService.getPostById(req.params.id);
      if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
      }
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  static async getPostByUserId(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const post = await PostService.getPostByUserId(userId);
      if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
      }
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  static async updatePost(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const updatedPost = await PostService.updatePost(req.params.id, req.body, req.user.id);
      res.status(200).json(updatedPost);
    } catch (error) {
      res.status(403).json({ message: (error as Error).message });
    }
  }

  static async deletePost(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      await PostService.deletePost(req.params.id, req.user.id);
      res.status(204).send();
    } catch (error) {
      res.status(403).json({ message: (error as Error).message });
    }
  }
}
