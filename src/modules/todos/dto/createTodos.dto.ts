import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateTodosDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsBoolean()
  completed: boolean;
}
