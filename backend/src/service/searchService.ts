import { AppDataSource } from "../config/database";
import { Post } from "../models/Post";
import { User } from "../models/User";
import { Like } from "typeorm";

export class SearchService {
  static async searchPosts(query: string) {
    const postRepository = AppDataSource.getRepository(Post);
    
    const posts = await postRepository.find({
      where: [
        { title: Like(`%${query}%`) },
        { content: Like(`%${query}%`) },
        { tags: Like(`%${query}%`) }
      ],
      relations: ["author"],
      order: { createdAt: "DESC" },
      take: 10
    });

    return posts;
  }

  static async searchUsers(query: string) {
    const userRepository = AppDataSource.getRepository(User);
    
    const users = await userRepository.find({
      where: [
        { userName: Like(`%${query}%`) },
        { name: Like(`%${query}%`) },
        { bio: Like(`%${query}%`) }
      ],
      select: ["id", "userName", "name", "bio", "profilePicture"],
      order: { userName: "ASC" },
      take: 10
    });

    return users;
  }

  static async searchAll(query: string) {
    const [posts, users] = await Promise.all([
      this.searchPosts(query),
      this.searchUsers(query)
    ]);

    return {
      posts,
      users,
      totalResults: posts.length + users.length
    };
  }

  static async searchPostsByUser(query: string, userId: string) {
    const postRepository = AppDataSource.getRepository(Post);
    
    const posts = await postRepository.find({
      where: [
        { title: Like(`%${query}%`), authorId: userId },
        { content: Like(`%${query}%`), authorId: userId },
        { tags: Like(`%${query}%`), authorId: userId }
      ],
      relations: ["author"],
      order: { createdAt: "DESC" },
      take: 10
    });

    return posts;
  }

  static async getRecentPosts(limit: number = 5) {
    const postRepository = AppDataSource.getRepository(Post);
    
    const posts = await postRepository.find({
      relations: ["author"],
      order: { createdAt: "DESC" },
      take: limit
    });

    return posts;
  }

  static async getTrendingUsers(limit: number = 5) {
    const userRepository = AppDataSource.getRepository(User);
    
    // Get users with most posts (simple trending algorithm)
    const users = await userRepository
      .createQueryBuilder("user")
      .leftJoin("user.posts", "post")
      .select([
        "user.id",
        "user.userName", 
        "user.name",
        "user.bio",
        "user.profilePicture"
      ])
      .addSelect("COUNT(post.id)", "postCount")
      .groupBy("user.id")
      .orderBy("postCount", "DESC")
      .limit(limit)
      .getRawAndEntities();

    return users.entities;
  }
} 