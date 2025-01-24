import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/google');
};


// import { Request, Response, NextFunction } from 'express';

// export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   return res.status(401).json({ message: 'Unauthorized. Please log in.' });
// };
