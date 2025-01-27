import "reflect-metadata";
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { Post } from "./Post";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, nullable: true })
  googleId?: string;

  @Column()
  userName!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  profilePicture?: string;

  @OneToMany(() => Post, (post) => post.author)
  posts!: Post[];

  @Column({ default: true })
  isActive: boolean = true;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}