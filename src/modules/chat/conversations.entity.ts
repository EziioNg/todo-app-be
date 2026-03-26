import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ParticipantEntity } from './participants.entity';

@Entity('conversations')
export class ConversationEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(() => ParticipantEntity, (p) => p.conversation)
  participants!: ParticipantEntity[];

  @CreateDateColumn()
  createdAt!: Date;
}
