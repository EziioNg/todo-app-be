import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from 'src/auth/users/users.entity';
import { TaskStatus } from 'src/utils/constants';
import { TaskPriority } from 'src/utils/constants';

@Entity('tasks')
export class TasksEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  assignee!: string;

  @Column()
  userId!: number;

  @ManyToOne(() => UsersEntity, (user) => user.employeeProfile)
  @JoinColumn({ name: 'userId' })
  user!: UsersEntity;

  @Column()
  createdById!: number;

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'createdById' })
  createdBy!: UsersEntity;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status!: string;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority!: string;

  @Column({ type: 'timestamp' })
  dueDate!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
