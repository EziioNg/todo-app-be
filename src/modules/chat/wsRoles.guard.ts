import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticatedSocket } from 'src/common/types/socket-auth.type';

@Injectable()
export class WsRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) return true;

    const client = context.switchToWs().getClient<AuthenticatedSocket>();
    const user = client.data.user;

    return requiredRoles.includes(user.role);
  }
}
