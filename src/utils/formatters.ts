import { pick } from 'lodash';
import { UsersEntity } from 'src/auth/users/users.entity';
import { UserResponse } from 'src/common/types/user-response.type';
import { TaskResponse } from 'src/common/types/task-response.type';
import { TasksEntity } from 'src/modules/tasks/tasks.entity';

export const pickUser = (user: UsersEntity | null): UserResponse | null => {
  if (!user) return null;

  return pick(user, [
    'id',
    'email',
    'username',
    'role',
    'isFirstLogin',
    'createdAt',
    'updatedAt',
  ]) as UserResponse;
};

export const pickTask = (task: TasksEntity | null): TaskResponse | null => {
  if (!task) return null;

  return pick(task, [
    'id',
    'title',
    'description',
    'assignee',
    'userId',
    'createdAt',
    'updatedAt',
  ]) as TaskResponse;
};
