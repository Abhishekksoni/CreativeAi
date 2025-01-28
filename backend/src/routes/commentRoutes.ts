import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware";
import { CommentController } from "../controllers/commentController";


const router = express.Router();

router.post("/", isAuthenticated, CommentController.addComment);
router.get("/:postId", CommentController.getComments);
router.delete("/:commentId", isAuthenticated, CommentController.deleteComment);

export default router;
