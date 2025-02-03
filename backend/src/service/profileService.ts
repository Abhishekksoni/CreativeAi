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


  static async updateProfile(userId: string, updateData: Partial<User>): Promise<User> {
    if (!userId) {
        throw new Error("User ID is required for updating the profile.");
    }

    const userRepository = AppDataSource.getRepository(User);
    
    // Check if user exists
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
        throw new Error("User not found.");
    }

    // Update user
    await userRepository.update(userId, updateData);

    // Fetch and return the updated user
    const updatedUser = await userRepository.findOne({ where: { id: userId } });

    return updatedUser!;
}
}