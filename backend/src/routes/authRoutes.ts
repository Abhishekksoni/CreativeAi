import express from 'express';
import passport from 'passport';
import { loginSuccess, logout } from '../controllers/authController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = express.Router();

// Google Authentication Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('http://localhost:5173/profile');
  }
);

router.get('/profile', isAuthenticated, loginSuccess);
router.get('/logout', logout);

export default router;
