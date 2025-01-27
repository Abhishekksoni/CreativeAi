import { AppDataSource } from '../config/database';
import { User } from '../models/User';

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async findOrCreateUser(profile: any): Promise<User> {
    const existingUser = await this.userRepository.findOne({ 
      where: { 
        email: profile.emails[0].value 
      } 
    });

    if (existingUser) {
      return existingUser;
    }

    const newUser = this.userRepository.create({
      googleId: profile.id,
      userName: profile.displayName,
      email: profile.emails[0].value,
      profilePicture: profile.photos[0].value
    });

    return this.userRepository.save(newUser);
  }
}