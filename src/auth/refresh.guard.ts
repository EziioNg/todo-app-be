import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request as ExpressRequest } from 'express';
import { JwtPayload } from '../common/types/jwt-payload.type';
import { jwtConstants } from 'src/utils/constants';

interface AuthenticatedRequest extends ExpressRequest {
  user: JwtPayload;
  cookies: {
    refresh_token?: string;
  };
}

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const refreshToken = request.cookies?.refresh_token;
    // console.log('refresh token recieved: ', refreshToken);

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: jwtConstants.secret,
        },
      );

      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
