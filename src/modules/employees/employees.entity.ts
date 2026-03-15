import { UsersEntity } from 'src/auth/users/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('employees')
export class EmployeesEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @OneToOne(() => UsersEntity, (user) => user.employeeProfile)
  @JoinColumn({ name: 'userId' })
  user!: UsersEntity;

  @Column()
  employee_phone!: string;

  @Column()
  createdById!: number;

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'createdById' })
  createdBy!: UsersEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
