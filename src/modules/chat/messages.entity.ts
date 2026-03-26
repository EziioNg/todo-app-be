import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from 'src/auth/users/users.entity';
import { ConversationEntity } from './conversations.entity';

@Entity('messages')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  conversationId!: number;

  @Column()
  senderId!: number;

  @Column()
  content!: string;

  @ManyToOne(() => ConversationEntity)
  @JoinColumn({ name: 'conversationId' })
  conversation!: ConversationEntity;

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'senderId' })
  sender!: UsersEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
