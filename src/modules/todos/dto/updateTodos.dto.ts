import { PartialType } from '@nestjs/mapped-types';
import { CreateTodosDto } from './createTodos.dto';

export class UpdateTodosDto extends PartialType(CreateTodosDto) {}
