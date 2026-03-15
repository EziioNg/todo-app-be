import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateEmployeesDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  employee_name!: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsString()
  employee_email!: string;

  @IsOptional()
  @IsString()
  employee_phone!: string;
}
