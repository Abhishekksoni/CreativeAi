import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
// import { NotFoundError, UnauthorizedError } from '../errors';
import { ProfileService } from '../service/profileService';


export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id || (req.user as User).id; // Use logged-in user's ID if no userId is provided
    const profile = await ProfileService.getProfile(userId);

    if (!profile) {
      throw new Error('Profile not found');
    }

    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
};

// export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const userId = (req.user as User).id; // Only allow updating the logged-in user's profile
//     const { userName, bio, location, profilePicture } = req.body;

//     const updatedProfile = await ProfileService.updateProfile(userId, {
//       userName,
//       bio,
//       location,
//       profilePicture,
//     });

//     res.status(200).json(updatedProfile);
//   } catch (err) {
//     next(err);
//   }
// };