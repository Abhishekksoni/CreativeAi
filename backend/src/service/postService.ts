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

  // static async toggleReaction(userId: string, postId: string) {
  //   const reactionRepo = AppDataSource.getRepository(PostReaction);
  //   const postRepo = AppDataSource.getRepository(Post);
  //   const userRepo = AppDataSource.getRepository(User);

  //   const post = await postRepo.findOne({where:{id:postId}});
  //   if (!post) throw new Error("Post not found");

  //   const user = await userRepo.findOne({where: {id :userId}});
  //   if (!user) throw new Error("User not found");

  //   const existingReaction = await reactionRepo.findOne({ where: { post, user } });

  //   if (existingReaction) {
  //     await reactionRepo.remove(existingReaction);
  //     return { message: "Reaction removed" };
  //   } else {
  //     const newReaction = reactionRepo.create({ post, user });
  //     await reactionRepo.save(newReaction);
  //     return { message: "Post liked" };
  //   }
  // }

  // static async toggleSavePost(userId: string, postId: string) {
  //   const saveRepo = getRepository(SavedPost);
  //   const postRepo = getRepository(Post);
  //   const userRepo = getRepository(User);

  //   const post = await postRepo.findOne(postId);
  //   if (!post) throw new Error("Post not found");

  //   const user = await userRepo.findOne(userId);
  //   if (!user) throw new Error("User not found");

  //   const existingSave = await saveRepo.findOne({ where: { post, user } });

  //   if (existingSave) {
  //     await saveRepo.remove(existingSave);
  //     return { message: "Post unsaved" };
  //   } else {
  //     const newSave = saveRepo.create({ post, user });
  //     await saveRepo.save(newSave);
  //     return { message: "Post saved" };
  //   }
  // }

  static async getAllPosts() {
    return await AppDataSource.getRepository(Post).find({ relations: ["author"] });
  }

  static async getPostById(id: string) {
    return await AppDataSource.getRepository(Post).findOne({ where: { id }, relations: ["author"] });
  }
  static async getPostByUserId(userId: string) {
    return await AppDataSource.getRepository(Post).find({  where: { authorId: userId },
      relations: ['author'] });
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
