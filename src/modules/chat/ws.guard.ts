import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  GoneException,
} from '@nestjs/common';
import * as cookie from 'cookie';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { JwtPayload } from 'src/common/types/jwt-payload.type';
import { jwtConstants } from 'src/utils/constants';
import { AuthenticatedSocket } from 'src/common/types/socket-auth.type';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<AuthenticatedSocket>();
    const rawCookie = client.handshake.headers.cookie;

    if (!rawCookie) {
      throw new UnauthorizedException('No cookie');
    }

    const parsed = cookie.parse(rawCookie);
    const token = parsed['access_token'];
    // console.log('token: ', token);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: jwtConstants.secret,
      });
      // console.log('payload: ', payload);

      client.data.user = payload;

      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new GoneException('Access token expired');
      }

      throw new UnauthorizedException('Invalid access token');
    }
  }
}
