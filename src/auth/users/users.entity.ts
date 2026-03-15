import { EmployeesEntity } from 'src/modules/employees/employees.entity';
import { TodosEntity } from 'src/modules/todos/todos.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  role!: string;

  // 1 user có nhiều todos
  @OneToMany(() => TodosEntity, (todo) => todo.user)
  todos!: TodosEntity[];

  @OneToOne(() => EmployeesEntity, (employee) => employee.user)
  employeeProfile!: EmployeesEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
