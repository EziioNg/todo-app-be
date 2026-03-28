import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ParticipantEntity } from 'src/modules/chat/participants.entity';
import { EmployeesEntity } from 'src/modules/employees/employees.entity';
import { TasksEntity } from 'src/modules/tasks/tasks.entity';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column({ default: false })
  isAdminActive!: boolean;

  @Column({ default: false })
  isFirstLogin!: boolean;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  role!: string;

  @OneToOne(() => EmployeesEntity, (employee) => employee.user)
  employeeProfile!: EmployeesEntity;

  @OneToMany(() => TasksEntity, (task) => task.user)
  tasks!: TasksEntity[];

  @OneToMany(() => ParticipantEntity, (p) => p.user)
  participants!: ParticipantEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
