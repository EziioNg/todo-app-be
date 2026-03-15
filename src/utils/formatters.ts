import { pick } from 'lodash';
import { UsersEntity } from 'src/auth/users/users.entity';
import { UserResponse } from 'src/common/types/user-response.type';

export const pickUser = (user: UsersEntity | null): UserResponse | null => {
  if (!user) return null;

  return pick(user, [
    'id',
    'email',
    'username',
    'role',
    'createdAt',
    'updatedAt',
  ]) as UserResponse;
};
