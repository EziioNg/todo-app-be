/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import express from 'express';
import ms from 'ms';

import { AuthService } from './auth.service';
import { HttpStatusCode } from 'src/global/globalEnum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthGuard } from './auth.guard';
import type { JwtPayload } from './types/jwt-payload.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.register(username, email, password);
  }

  @HttpCode(HttpStatusCode.SUCCESS)
  @Post('login')
  async signIn(
    @Body() signInDto: Record<string, any>,
    @Res({ passthrough: true }) response: express.Response,
  ) {
    const result = await this.authService.login(
      signInDto.username,
      signInDto.password,
    );
    const { access_token } = result;

    response.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'lax',
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
      sameSite: 'lax',
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
