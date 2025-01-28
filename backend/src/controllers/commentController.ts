import { Request, Response } from "express";
import { CommentService } from "../service/commentService";


export class CommentController {
  static async addComment(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const { postId, content, parentCommentId } = req.body;
      const comment = await CommentService.createComment(req.user.id, postId, content, parentCommentId);
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  static async getComments(req: Request, res: Response) {
    try {
      const postId = req.params.postId;
      const comments = await CommentService.getCommentsByPost(postId);
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }


  static async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      await CommentService.deleteComment(req.params.commentId, req.user.id);
      res.status(204).send();
    } catch (error) {
      res.status(403).json({ message: (error as Error).message });
    }
  }
}
