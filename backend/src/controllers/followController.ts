import { Request, Response } from 'express';
import { FollowService } from '../service/followService';

export class FollowController {

  async followUser(req: Request, res: Response): Promise<void> {
    const { followerId, followingId } = req.params;

    try {
      await FollowService.followUser(followerId, followingId);
      res.status(200).json({ message: 'Followed successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async unfollowUser(req: Request, res: Response): Promise<void> {
    const { followerId, followingId } = req.params;

    try {
      await FollowService.unfollowUser(followerId, followingId);
      res.status(200).json({ message: 'Unfollowed successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getFollowers(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    try {
      const followers = await FollowService.getFollowers(userId);
      res.status(200).json(followers);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getFollowing(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    try {
      const following = await FollowService.getFollowing(userId);
      res.status(200).json(following);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
