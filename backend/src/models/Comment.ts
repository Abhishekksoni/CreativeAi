// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
// import { Post } from "./Post";


// @Entity("comments")
// export class Comment {
//   @PrimaryGeneratedColumn()
//   id!: number;

//   @Column({ type: "text" })
//   content!: string;

//   @Column()
//   userName!: string;

//   @Column({ nullable: true })
//   profilePicture?: string;

//   @ManyToOne(() => Post, (post) => post.comments, { onDelete: "CASCADE" })
//   post!: Post;

//   @CreateDateColumn()
//   createdAt!: Date;
// }
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";


@Entity()
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text" })
  content!: string;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: "CASCADE" })
  post!: Post;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: "CASCADE" })
  author!: User;

  @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true, onDelete: "CASCADE" })
  parentComment?: Comment | null;

  @OneToMany(() => Comment, (comment) => comment.parentComment)
  replies!: Comment[];

  @Column({ default: 0 })
  level?: number;

  @CreateDateColumn()
  createdAt!: Date;
}
