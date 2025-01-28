import { AppDataSource } from "../config/database";
import { Post } from "../models/Post";
import { User } from "../models/User";

export class PostService {
  static async createPost(userId: string, postData: Partial<Post>): Promise<Post> {
    const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });
    if (!user) throw new Error("User not found");

    const newPost = AppDataSource.getRepository(Post).create({
      ...postData,
      author: { id: userId },
    });

    return await AppDataSource.getRepository(Post).save(newPost);
  }

  static async getAllPosts() {
    return await AppDataSource.getRepository(Post).find({ relations: ["author"] });
  }

  static async getPostById(id: string) {
    return await AppDataSource.getRepository(Post).findOne({ where: { id }, relations: ["author"] });
  }
  static async getPostByUserId(userId: string) {
    return await AppDataSource.getRepository(Post).findOne({ where: { authorId: userId } });
  }

  static async updatePost(id: string, postData: Partial<Post>, userId: string) {
    const postRepository = AppDataSource.getRepository(Post);
    const post = await postRepository.findOne({ where: { id }, relations: ["author"] });

    if (!post ) throw new Error("Unauthorized");

    Object.assign(post, postData);
    return await postRepository.save(post);
  }

  static async deletePost(id: string, userId: string) {
    const postRepository = AppDataSource.getRepository(Post);
    const post = await postRepository.findOne({ where: { id }, relations: ["author"] });

    if (!post ) throw new Error("Unauthorized");

    await postRepository.remove(post);
  }
}
