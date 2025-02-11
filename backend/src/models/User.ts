import "reflect-metadata";
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { Post } from "./Post";
import { Comment } from "./Comment";
import { UserFollow } from "./Folllow";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, nullable: true })
  googleId?: string;

  @Column({ unique: true, nullable: true})
  userName?: string;

  @Column()
  name?: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  profilePicture?: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ nullable: true })
  education?: string;

  @Column({ nullable: true })
  work?: string;

  // @Column({ default: false, nullable: true })
  // subscribeToNewsletter?: boolean;

  @Column({ default: false, nullable: true })
  isProfileSetup?: boolean;

  @OneToMany(() => Post, (post) => post.author)
  posts!: Post[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments?: Comment[];

   // Followers (users who follow this user)
   @OneToMany(() => UserFollow, (userFollow) => userFollow.following)
   followers!: UserFollow[];
 
   // Following (users this user follows)
   @OneToMany(() => UserFollow, (userFollow) => userFollow.follower)
   following!: UserFollow[];
 

  @Column({ default: true })
  isActive: boolean = true;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}