import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UsersEntity } from 'src/auth/users/users.entity';
import { ConversationEntity } from './conversations.entity';

@Entity('participants')
export class ParticipantEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  conversationId!: number;

  // 👉 user tham gia
  @ManyToOne(() => UsersEntity, (user) => user.participants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: UsersEntity;

  // 👉 conversation chứa participant này
  @ManyToOne(
    () => ConversationEntity,
    (conversation) => conversation.participants,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'conversationId' })
  conversation!: ConversationEntity;
}
