import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateTasksDto {
  @IsNotEmpty({ message: 'Task title is required!' })
  @IsString()
  task_title!: string;

  @IsOptional()
  @IsString()
  task_description!: string;

  @IsNotEmpty({ message: 'Employee id is required!' })
  @IsNumber()
  assigneeId!: number;

  @IsNotEmpty({ message: 'Task priority is required!' })
  @IsString()
  priority!: string;

  @IsNotEmpty()
  @IsString()
  dueDate!: string;
}
