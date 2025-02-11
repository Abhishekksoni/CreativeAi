import { AppDataSource } from '../config/database';
import { UserFollow } from '../models/Folllow';
import { User } from '../models/User';


export class FollowService {

  static async followUser(followerId: string, followingId: string): Promise<void> {
    const userRepository = AppDataSource.getRepository(User);
    const followRepository = AppDataSource.getRepository(UserFollow);

    const follower = await userRepository.findOne({ where: { id: followerId } });
    const following = await userRepository.findOne({ where: { id: followingId } });

    if (!follower || !following) {
      throw new Error('User not found');
    }

    // Check if the follow relationship already exists
    const existingFollow = await followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });

    if (existingFollow) {
      throw new Error('Already following this user');
    }

    // Create a new follow record
    const follow = followRepository.create({ follower, following });
    await followRepository.save(follow);
  }

  static async unfollowUser(followerId: string, followingId: string): Promise<void> {
    const followRepository = AppDataSource.getRepository(UserFollow);

    const follow = await followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });

    if (!follow) {
      throw new Error('Not following this user');
    }

    await followRepository.remove(follow);
  }

  static async getFollowers(userId: string): Promise<User[]> {
    const followRepository = AppDataSource.getRepository(UserFollow);

    const followers = await followRepository.find({
      where: { following: { id: userId } },
      relations: ['follower'],
    });

    return followers.map(follow => follow.follower);
  }

  static async getFollowing(userId: string): Promise<User[]> {
    const followRepository = AppDataSource.getRepository(UserFollow);

    const following = await followRepository.find({
      where: { follower: { id: userId } },
      relations: ['following'],
    });

    return following.map(follow => follow.following);
  }
}
