import express from 'express';
import { FollowController } from '../controllers/followController';


const router = express.Router();
const followController = new FollowController();

router.post('/follow/:followerId/:followingId', followController.followUser);
router.post('/unfollow/:followerId/:followingId', followController.unfollowUser);
router.get('/followers/:userId', followController.getFollowers);
router.get('/following/:userId', followController.getFollowing);

export default router;