import express from "express";
import { SearchController } from "../controllers/searchController";

const router = express.Router();

// Search all (posts and users)
router.get("/all", SearchController.searchAll);

// Search posts only
router.get("/posts", SearchController.searchPosts);

// Search users only
router.get("/users", SearchController.searchUsers);

// Search posts by specific user
router.get("/user/:userId/posts", SearchController.searchUserPosts);

// Get recent posts
router.get("/recent-posts", SearchController.getRecentPosts);

// Get trending users
router.get("/trending-users", SearchController.getTrendingUsers);

export default router; 