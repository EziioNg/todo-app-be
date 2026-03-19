import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTasksDto } from './dtos/createTasks.dto';
import { Repository } from 'typeorm';
import { UsersEntity } from 'src/auth/users/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksEntity } from './tasks.entity';
import { pickTask, pickUser } from 'src/utils/formatters';
import { TaskResponse } from 'src/common/types/task-response.type';
import { TaskStatus } from 'src/utils/constants';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
    @InjectRepository(TasksEntity)
    private taskRepository: Repository<TasksEntity>,
  ) {}

  async findTasksByAdmin(adminId: number): Promise<TaskResponse[]> {
    const tasks = await this.taskRepository.find({
      where: {
        createdBy: {
          id: adminId,
        },
      },
      relations: {
        user: true,
      },
      order: { createdAt: 'DESC' },
    });

    return tasks;
  }

  async findTasksByUser(employeeId: number): Promise<TaskResponse[]> {
    const tasks = await this.taskRepository.find({
      where: {
        userId: employeeId,
      },
      relations: {
        user: true,
      },
      order: { createdAt: 'DESC' },
    });

    return tasks.map((task) => ({
      ...task,
      user: pickUser(task.user),
    }));
  }

  async createTask(data: CreateTasksDto, adminId: number) {
    const user = await this.userRepository.findOne({
      where: { id: data.assigneeId },
    });
    if (!user) throw new NotFoundException('User not found!');
    if (user.role !== 'employee')
      throw new BadRequestException('Can only assign task to employee!');

    const task = this.taskRepository.create({
      title: data.task_title,
      description: data.task_description,
      assignee: user.username,
      userId: data.assigneeId,
      createdById: adminId,
      priority: data.priority,
      dueDate: data.dueDate,
    });
    const newTask = await this.taskRepository.save(task);

    return pickTask(newTask);
  }

  async deleteTask(taskId: number, adminId: number) {
    const task = await this.taskRepository.findOne({
      where: {
        id: taskId,
      },
      relations: { user: true },
    });
    // console.log('task: ', task);

    if (!task) throw new NotFoundException('Task not found!');
    if (task.createdById !== adminId)
      throw new ForbiddenException('You cannot delete this task');

    await this.taskRepository.delete(task.id);

    return {
      message: 'Task deleted successfully',
    };
  }

  async updateTaskStatus(
    employeeId: number,
    taskId: number,
    taskStatus: TaskStatus,
  ) {
    const task = await this.taskRepository.findOne({
      where: {
        id: taskId,
        userId: employeeId,
      },
    });
    if (!task) throw new NotFoundException('Task not found!');

    task.status = taskStatus;
    const updatedTask = await this.taskRepository.save(task);

    return updatedTask;
  }
}
