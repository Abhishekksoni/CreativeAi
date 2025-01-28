import { IsNull } from "typeorm";
import { AppDataSource } from "../config/database";
import { Comment } from "../models/Comment";
import { Post } from "../models/Post";
import { User } from "../models/User";

export class CommentService {

        static async createComment(userId: string, postId: string, content: string, parentCommentId?: string) {
          const commentRepository = AppDataSource.getRepository(Comment);
          
          const comment = commentRepository.create({
            content,
            author: { id: userId },
            post: { id: postId },
            level: 0
          });
      
          if (parentCommentId) {
            const parentComment = await commentRepository.findOne({
              where: { id: parentCommentId },
              relations: ['parentComment']
            });
      
            if (parentComment) {
              comment.parentComment = parentComment;
              comment.level = (parentComment.level || 0) + 1;
            }
          }
      
          return await commentRepository.save(comment);
        }
      
        static async getCommentsByPost(postId: string): Promise<Comment[]> {
          const comments = await AppDataSource.getRepository(Comment)
            .createQueryBuilder('comment')
            .leftJoinAndSelect('comment.author', 'author')
            .leftJoinAndSelect('comment.replies', 'replies')
            .leftJoinAndSelect('replies.author', 'replyAuthor')
            .where('comment.post.id = :postId', { postId })
            .andWhere('comment.parentComment IS NULL')
            .orderBy('comment.createdAt', 'DESC')
            .addOrderBy('replies.createdAt', 'ASC')
            .getMany();
      
          return comments;
        }


//   static async getCommentsByPostId(postId: string): Promise<Comment[]> {
//     return await AppDataSource.getRepository(Comment).find({
//       where: { post: { id: postId } },
//       relations: ["author"],
//       order: { createdAt: "DESC" },
//     });
//   }

  static async deleteComment(commentId: string, userId: string): Promise<void> {
    const commentRepository = AppDataSource.getRepository(Comment);
    const comment = await commentRepository.findOne({ where: { id: commentId }, relations: ["author"] });

    if (!comment) throw new Error("Comment not found");
    if (comment.author.id !== userId) throw new Error("Unauthorized");

    await commentRepository.remove(comment);
  }
}
