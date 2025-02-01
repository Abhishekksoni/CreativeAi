import { Request, Response } from 'express';

// Handle successful login and send user profile data
export const loginSuccess = (req: Request, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  const user = req.user as any;

  res.status(200).json({
    id: user.id,
    userName: user.userName || 'Unknown',
    name: user.name || 'Unknown',
    work:user.work,
    education: user.education,
    bio:user.bio,
    email: user.email || 'No email provided',
    avatar: user.profilePicture || '/default-avatar.png',
    role: user.role || 'Customer',
  });
};

// Handle user logout
export const logout = (req: Request, res: Response): void => {
  req.logout((err) => {
    if (err) {
      console.error('Logout Error:', err);
      return res.status(500).json({ message: 'Logout failed', error: err.message });
    }

    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        console.error('Session Destruction Error:', sessionErr);
        return res.status(500).json({ message: 'Session destruction failed', error: sessionErr.message });
      }

      res.clearCookie('connect.sid', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      console.log('User successfully logged out');
      res.status(200).json({ message: 'Logout successful' });
    });
  });
};
