import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity('user_follows')
export class UserFollow {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
  follower!: User;

  @ManyToOne(() => User, (user) => user.following, { onDelete: 'CASCADE' })
  following!: User;
}
