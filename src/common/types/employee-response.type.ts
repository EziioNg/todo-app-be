import { EmployeesEntity } from 'src/modules/employees/employees.entity';
import { UserResponse } from './user-response.type';

export type EmployeeResponse = Omit<EmployeesEntity, 'user'> & {
  user: UserResponse | null;
};
