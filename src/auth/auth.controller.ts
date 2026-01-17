import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import express from 'express';
import ms from 'ms';

import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { HttpStatusCode } from 'src/global/globalEnum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from './types/jwt-payload.type';
import { RegisterUsers } from './users/dto/registerUsers.dto';
import { LoginUsers } from './users/dto/loginUsers.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body(new ValidationPipe({ whitelist: true }))
    body: RegisterUsers,
  ) {
    const { username, email, password } = body;
    return this.authService.register(username, email, password);
  }

  @HttpCode(HttpStatusCode.SUCCESS)
  @Post('login')
  async signIn(
    @Body(new ValidationPipe({ whitelist: true }))
    body: LoginUsers,
    @Res({ passthrough: true }) response: express.Response,
  ) {
    const { username, password } = body;

    const result = await this.authService.login(username, password);
    const { access_token } = result;

    response.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('5m'),
    });
    return {
      message: 'Login successfully!',
    };
  }

  @HttpCode(HttpStatusCode.SUCCESS)
  @Post('logout')
  logOut(@Res({ passthrough: true }) res: express.Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return {
      message: 'Logout successfully!',
    };
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: JwtPayload) {
    return {
      id: user.sub,
      email: user.email,
      username: user.username,
    };
  }
}
