import { IsString, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTodosDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  title!: string;

  @IsOptional()
  @IsBoolean()
  completed!: boolean;
}
