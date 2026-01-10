import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodosDto } from './dto/createTodos.dto';
import { UpdateTodosDto } from './dto/updateTodos.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @UseGuards(AuthGuard)
  // @Get()findAll() {return this.todosService.findAll();}
  @Get()
  async findTodosByUser(@CurrentUser() user: JwtPayload) {
    const userId = user.sub;
    const todos = await this.todosService.findByUser(userId);
    // console.log('userId: ', userId);
    // console.log('todos received: ', todos);

    return todos;
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createTodo(
    @Body(new ValidationPipe()) body: CreateTodosDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const userId = user.sub;
    // console.log('userId: ', userId);
    return this.todosService.createTodo(body, userId);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) body: UpdateTodosDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const userId = user.sub;
    // console.log('userId: ', userId);
    return this.todosService.updateTodo(id, body, userId);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const userId = user.sub;
    // console.log('userId: ', userId);
    return this.todosService.deleteTodo(id, userId);
  }
}
