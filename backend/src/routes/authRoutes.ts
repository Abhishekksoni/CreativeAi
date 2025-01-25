import express, { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { loginSuccess, logout } from '../controllers/authController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = express.Router();

// Google Authentication Initiation
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google Authentication Callback
router.get('/google/callback', (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', (err: any, user: any) => {
    if (err) {
      console.error('OAuth Error:', err);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=user_not_found`);
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error('Login Error:', loginErr);
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=login_failed`);
      }
      return res.redirect(`${process.env.FRONTEND_URL}/profile`);
    });
  })(req, res, next);
});

// User Profile
router.get('/profile', isAuthenticated, loginSuccess);

// User Logout
router.get('/logout', logout);

export default router;
