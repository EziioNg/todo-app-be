import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import express from 'express';
import ms from 'ms';

import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/types/jwt-payload.type';
import { RegisterUsersDto } from './dto/registerUsers.dto';
import { LoginUsersDto } from './dto/loginUsers.dto';
import { updateFirstPasswordDto } from './dto/updateFirstPassword.dto';
import { RefreshTokenGuard } from './refresh.guard';
import { VerifyUserFirstLoginDto } from './dto/verifyUserFirstLogin.dto';
import { VerifyAdminDto } from './dto/verifyAdmin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body(new ValidationPipe({ whitelist: true }))
    body: RegisterUsersDto,
  ) {
    const { username, email, password } = body;
    return this.authService.register(username, email, password);
  }

  @Post('login')
  async signIn(
    @Body(new ValidationPipe({ whitelist: true }))
    body: LoginUsersDto,
    @Res({ passthrough: true }) response: express.Response,
  ) {
    const { username, password } = body;

    const result = await this.authService.login(username, password);
    const { access_token, refresh_token, ...user } = result;

    response.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: '.eziio.site',
      maxAge: ms('1h'),
    });

    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: '.eziio.site',
      maxAge: ms('1w'),
    });
    return user;
  }

  @Post('logout')
  logOut(@Res({ passthrough: true }) res: express.Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.clearCookie('refresh_token', {
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
      role: user.role,
    };
  }

  @Post('verify-first-login-token')
  verifyFirstLogin(@Body() data: VerifyUserFirstLoginDto) {
    return this.authService.verifyFirstLogin(data.token);
  }

  @Post('verify-admin-token')
  verifyAdmin(@Body() data: VerifyAdminDto) {
    return this.authService.verifyAdmin(data.token);
  }

  @Post('update-password')
  async updateFirstPassword(
    @Body(new ValidationPipe({ whitelist: true })) body: updateFirstPasswordDto,
  ) {
    const { token, user_email, new_username, new_password } = body;

    const result = await this.authService.updateFirstPassword(
      token,
      user_email,
      new_username,
      new_password,
    );

    return result;
  }

  @UseGuards(RefreshTokenGuard)
  @Put('refresh_token')
  async refreshToken(
    @Res({ passthrough: true }) response: express.Response,
    @CurrentUser() user: JwtPayload,
  ) {
    const userId = user.sub;
    // console.log('userId: ', userId);

    const result = await this.authService.refreshToken(userId);
    const { new_access_token } = result;

    response.cookie('access_token', new_access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: '.eziio.site',
      maxAge: ms('1h'),
    });

    return result;
  }
}
