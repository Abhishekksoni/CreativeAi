import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User'; // Assuming you have a User entity

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title?: string;

  @Column({ type: 'text' })
  content?: string;

  @Column({ type: 'varchar', nullable: true })
  imageUrl?: string;

  @Column({ type: 'int', default: 0 })
  likes?: number;

  @Column({ type: 'int', default: 0 })
  comments?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tags?: string;

  @ManyToOne(() => User, user => user.posts)
  author!: User;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt!: Date;
}