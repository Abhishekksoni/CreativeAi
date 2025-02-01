import { AppDataSource } from '../config/database';
import { User } from '../models/User';


export class ProfileService {
  static async getProfile(userId: string) {
    const user = await AppDataSource.getRepository(User).findOne({ where: { id : userId } })
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  static async buildProfile(userId: string, userName: string, bio?: string) {
    const existingUser = await AppDataSource.getRepository(User).findOne({ where: { userName:userName } });
    if (existingUser && existingUser.id !== userId) {
      throw new Error('Username is already taken');
    }

    // Find the user by ID
    const user = await AppDataSource.getRepository(User).findOne({where:{id:userId}});
    if (!user) {
      throw new Error('User not found');
    }

    // Update the user's profile
    user.userName = userName;
    if (bio) {
      user.bio = bio;
    }
    if (!user.isProfileSetup) {

      user.isProfileSetup = true;
      
      }

    // Save the updated user
    await AppDataSource.getRepository(User).save(user);

    return user;
  }

  static async checkUsernameAvailability(
    userId: string,
    username: string
  ): Promise<boolean> {
    const existingUser = await AppDataSource.getRepository(User).findOne({
      where: { userName: username },
    });

    // Username is taken by another user
    if (existingUser && existingUser.id !== userId) {
      return false;
    }

    // Username is available
    return true;
  }


//   static async updateProfile(userId: string, updateData: Partial<User>) {
//     const user = await User.findByIdAndUpdate(userId, updateData, {
//       new: true, // Return the updated document
//       runValidators: true, // Validate the update data
//     }).select('-password -__v');

//     if (!user) {
//       throw new NotFoundError('User not found');
//     }

//     return user;
//   }
}