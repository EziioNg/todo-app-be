import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTaskDescDto {
  @IsNotEmpty({ message: 'New task title is required!' })
  @IsString()
  title!: string;

  @IsNotEmpty({ message: 'New task description is required!' })
  @IsString()
  description!: string;

  @IsNotEmpty({ message: 'New task priority is required!' })
  @IsString()
  priority!: string;
}
