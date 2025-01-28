import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware";
import { PostController } from "../controllers/postController";


const router = express.Router();

router.post("/", isAuthenticated, PostController.createPost);
router.get("/", PostController.getAllPosts);
router.get("/:id", PostController.getPostById);
router.get("/user/:userId", PostController.getPostByUserId);
router.put("/:id", isAuthenticated, PostController.updatePost);
router.delete("/:id", isAuthenticated, PostController.deletePost);

export default router;