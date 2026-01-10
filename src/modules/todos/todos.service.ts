/* eslint-disable @typescript-eslint/no-misused-promises */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TodosEntity } from './todos.entity';
import { Repository } from 'typeorm';
import { CreateTodosDto } from './dto/createTodos.dto';
import { UpdateTodosDto } from './dto/updateTodos.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(TodosEntity)
    private todosRepository: Repository<TodosEntity>,
  ) {}

  findAll(): Promise<TodosEntity[]> {
    const todos = this.todosRepository.find();

    if (!todos) throw new NotFoundException('Error getting todos');

    return todos;
  }

  findByUser(userId: number): Promise<TodosEntity[]> {
    return this.todosRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<TodosEntity | null> {
    const todo = await this.todosRepository.findOneBy({ id });

    if (!todo) throw new NotFoundException('Todo not found');

    return todo;
  }

  createTodo(data: CreateTodosDto, userId: number): Promise<TodosEntity> {
    const todo = this.todosRepository.create({
      ...data,
      userId,
    });
    const createdTodo = this.todosRepository.save(todo);

    return createdTodo;
  }

  async updateTodo(
    id: number,
    data: UpdateTodosDto,
    userId: number,
  ): Promise<TodosEntity> {
    const todo = await this.todosRepository.findOne({
      where: { id, userId },
    });

    if (!todo) throw new NotFoundException('Todo not found');

    const updated = this.todosRepository.merge(todo, data);
    const updatedTodo = this.todosRepository.save(updated);

    return updatedTodo;
  }

  async deleteTodo(id: number, userId: number): Promise<void> {
    const result = await this.todosRepository.delete({
      id: id,
      user: { id: userId },
    });

    if (result.affected === 0) throw new NotFoundException('Todo not found');
  }
}
