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