import { getRepository } from 'typeorm';
import { User } from '../models/User';
import { AppDataSource } from '../config/database';


export class FollowService {


  static async followUser(followerId: string, followingId: string): Promise<void> {
    const follower = await AppDataSource.getRepository(User).findOne({
      where: { id: followerId },
      relations: ['following'], // Include the 'following' relation
    });
    const following = await AppDataSource.getRepository(User).findOne({
      where: { id: followingId },
    });

    if (!follower || !following) {
      throw new Error('User not found');
    }

    follower.following.push(following);
    await AppDataSource.getRepository(User).save(follower);
  }

  static async unfollowUser(followerId: string, followingId: string): Promise<void> {
    const follower = await AppDataSource.getRepository(User).findOne({
      where: { id: followerId },
      relations: ['following'], // Include the 'following' relation
    });

    if (!follower) {
      throw new Error('User not found');
    }

    follower.following = follower.following.filter(user => user.id !== followingId);
    await AppDataSource.getRepository(User).save(follower);
  }

  static async getFollowers(userId: string): Promise<User[]> {
    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: userId },
      relations: ['followers'], // Include the 'followers' relation
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.followers;
  }

  static async getFollowing(userId: string): Promise<User[]> {
    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: userId },
      relations: ['following'], // Include the 'following' relation
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.following;
  }
}