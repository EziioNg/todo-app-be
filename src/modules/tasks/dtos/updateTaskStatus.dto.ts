import { IsEnum, IsNotEmpty } from 'class-validator';
import { TaskStatus } from 'src/utils/constants';

export class UpdateTaskStatusDto {
  @IsNotEmpty({ message: 'Status is required!' })
  @IsEnum(TaskStatus)
  status!: TaskStatus;
}
