import { Request, Response } from 'express';

export const loginSuccess = (req: Request, res: Response) => {
  if (req.user) {
    const user = req.user as any; // Use 'any' for flexibility

    res.status(200).json({
      id: user.id, // Add this
      displayName: user.displayName,
      email: user.emails[0].value,
      photos: user.photos?.[0]?.value || '/default-avatar.png', // Add this
      role: user.role || 'Customer' // Add role if applicable
    });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};


export const logout = (req: Request, res: Response): void => {
  req.logout((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).json({ message: 'Logout failed', error: err.message });
    }

    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        console.error('Error destroying session:', sessionErr);
        return res.status(500).json({ message: 'Session destruction failed', error: sessionErr.message });
      }

      res.clearCookie('connect.sid', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      console.log('User logged out successfully.');
      res.redirect('/');
    });
  });
};