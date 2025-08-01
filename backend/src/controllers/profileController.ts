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

export const buildProfile = async (req: Request, res: Response, next: NextFunction) => {

    const { userId } = req.params;
    const { userName, bio } = req.body;

    try {
      const updatedUser = await ProfileService.buildProfile((userId), userName, bio);
      
      res.status(200).json(updatedUser);
    } catch (error:any) {
      res.status(400).json({ message: error.message });
    }
  }

  export const checkUsernameAvailability = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { userId, username } = req.params;
  
    try {
      const isAvailable = await ProfileService.checkUsernameAvailability(
        userId,
        username
      );
      res.status(200).json({ available: isAvailable });
    } catch (error: any) {
      console.error('Error checking username availability:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("Params:", req.params);
    const { id: userId } = req.params;// Only allow updating the logged-in user's profile
    
    const { userName, bio, profilePicture } = req.body;
    
    console.log("Profile update request body:", { userName, bio, profilePicture });

    const updatedProfile = await ProfileService.updateProfile(userId, {
      userName,
      bio,
      profilePicture,
    });

    console.log("Updated profile response:", updatedProfile);

    res.status(200).json(updatedProfile);
  } catch (err) {
    next(err);
  }
};