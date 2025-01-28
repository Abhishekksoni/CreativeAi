import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User'; // Assuming you have a User entity
import { Comment } from './Comment';

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

  @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
  comments?: Comment[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  tags?: string;

  @ManyToOne(() => User, user => user.posts)
  author!: User;

  @Column()
  authorId!: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt!: Date;
}