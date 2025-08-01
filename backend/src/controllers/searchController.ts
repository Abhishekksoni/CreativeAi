import { Request, Response } from "express";
import { SearchService } from "../service/searchService";

export class SearchController {
  static async searchAll(req: Request, res: Response): Promise<void> {
    try {
      const { q: query } = req.query;
      
      if (!query || typeof query !== 'string') {
        res.status(400).json({ message: "Search query is required" });
        return;
      }

      const results = await SearchService.searchAll(query);
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  static async searchPosts(req: Request, res: Response): Promise<void> {
    try {
      const { q: query } = req.query;
      
      if (!query || typeof query !== 'string') {
        res.status(400).json({ message: "Search query is required" });
        return;
      }

      const posts = await SearchService.searchPosts(query);
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  static async searchUsers(req: Request, res: Response): Promise<void> {
    try {
      const { q: query } = req.query;
      
      if (!query || typeof query !== 'string') {
        res.status(400).json({ message: "Search query is required" });
        return;
      }

      const users = await SearchService.searchUsers(query);
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  static async searchUserPosts(req: Request, res: Response): Promise<void> {
    try {
      const { q: query } = req.query;
      const { userId } = req.params;
      
      if (!query || typeof query !== 'string') {
        res.status(400).json({ message: "Search query is required" });
        return;
      }

      const posts = await SearchService.searchPostsByUser(query, userId);
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  static async getRecentPosts(req: Request, res: Response): Promise<void> {
    try {
      const { limit = 5 } = req.query;
      const posts = await SearchService.getRecentPosts(Number(limit));
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  static async getTrendingUsers(req: Request, res: Response): Promise<void> {
    try {
      const { limit = 5 } = req.query;
      const users = await SearchService.getTrendingUsers(Number(limit));
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
} 