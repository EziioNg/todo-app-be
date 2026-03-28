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
import { TasksService } from './tasks.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import type { JwtPayload } from 'src/common/types/jwt-payload.type';
import { CreateTasksDto } from './dtos/createTasks.dto';
import { UpdateTaskStatusDto } from './dtos/updateTaskStatus.dto';
import { UpdateTaskDescDto } from './dtos/updateTaskDesc.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Get('get-tasks')
  async getTasks(@CurrentUser() user: JwtPayload) {
    const adminId = user.sub;
    const tasks = await this.tasksService.findTasksByAdmin(adminId);

    return tasks;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('employee')
  @Get('get-my-tasks')
  async getUserTasks(@CurrentUser() user: JwtPayload) {
    const employeeId = user.sub;
    const tasks = await this.tasksService.findTasksByUser(employeeId);

    return tasks;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Post('create-task')
  createTask(
    @Body(new ValidationPipe()) body: CreateTasksDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const adminId = user.sub;
    return this.tasksService.createTask(body, adminId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('delete-task/:id')
  deleteTask(
    @Param('id', ParseIntPipe) taskId: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const adminId = user.sub;
    return this.tasksService.deleteTask(taskId, adminId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Put('update-task-desc/:id')
  updateTaskDesc(
    @CurrentUser() user: JwtPayload,
    @Param('id') taskId: number,
    @Body() data: UpdateTaskDescDto,
  ) {
    const adminId = user.sub;
    // console.log('update data: ', data);
    const updatedTask = this.tasksService.updateTaskDesc(adminId, taskId, data);

    return updatedTask;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('employee')
  @Put('update-task-status/:id')
  updateTaskStatus(
    @CurrentUser() user: JwtPayload,
    @Param('id') taskId: number,
    @Body() data: UpdateTaskStatusDto,
  ) {
    const employeeId = user.sub;
    // console.log('new status: ', data.status);
    const updatedTask = this.tasksService.updateTaskStatus(
      employeeId,
      taskId,
      data.status,
    );

    return updatedTask;
  }
}
