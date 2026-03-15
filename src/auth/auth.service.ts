import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { UsersService } from 'src/auth/users/users.service';
import { UsersEntity } from './users/users.entity';
import { JwtPayload } from '../common/types/jwt-payload.type';
import { pickUser } from 'src/utils/formatters';
import { MailsService } from 'src/modules/mails/mails.service';

interface IuserInfo {
  sub: number;
  username: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    private mailsService: MailsService,
  ) {}

  async register(username: string, email: string, password: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userAdmin = await this.usersRepository.save({
      username: username,
      email: email,
      password: hashedPassword,
      role: 'admin',
      isAdminActive: false,
    });

    const adminVerifyToken = await this.jwtService.signAsync(
      {
        sub: userAdmin.id,
        email: userAdmin.email,
        type: 'verify_admin',
      },
      {
        expiresIn: '15m',
      },
    );

    const adminVerifyUrl = `http://localhost:3000/auth/verification-admin?token=${adminVerifyToken}`;
    await this.mailsService.sendAdminVerification(
      userAdmin.email,
      userAdmin.username,
      adminVerifyUrl,
    );

    return pickUser(userAdmin);
  }

  async login(
    username: string,
    pass: string,
  ): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const user = await this.usersService.findByName(username);
    if (!user) throw new NotFoundException('User not found');

    if (user.role === 'admin' && !user.isAdminActive) {
      throw new ForbiddenException(
        'Your Admin account must be verified first before using!',
      );
    }

    if (user.role === 'employee' && user.isFirstLogin) {
      throw new ForbiddenException(
        'Your Employee account must be verified first before using!',
      );
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userInfo: IuserInfo = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const access_token = await this.jwtService.signAsync(userInfo, {
      expiresIn: '1h',
    });
    const refresh_token = await this.jwtService.signAsync(userInfo, {
      expiresIn: '1w',
    });

    return { access_token, refresh_token, ...pickUser(user) };
  }

  async verifyFirstLogin(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      if (payload?.type !== 'first_login') {
        throw new UnauthorizedException('Invalid Token type!');
      }

      const user = await this.usersRepository.findOne({
        where: { id: payload.sub },
      });
      if (!user) throw new NotFoundException('User not found!');

      if (!user.isFirstLogin)
        throw new BadRequestException('Password already set!');

      return {
        valid: true,
        userId: user.id,
        username: user.username,
        email: user.email,
      };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token expired');
      }
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      }

      throw error;
    }
  }

  async updateFirstPassword(
    token: string,
    user_email: string,
    new_username: string,
    new_password: string,
  ) {
    const userWithThisEmail = await this.usersService.findByEmail(user_email);
    if (!userWithThisEmail)
      throw new NotFoundException('There is no user with this email!');

    const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
    if (payload.type !== 'first_login') {
      throw new UnauthorizedException('Invalid token type');
    }

    const user = await this.usersRepository.findOne({
      where: { id: payload.sub },
    });
    if (!user) throw new NotFoundException('User not found!');
    if (!user.isFirstLogin) {
      throw new BadRequestException('Password already set');
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await this.usersRepository.update(user.id, {
      username: new_username,
      password: hashedPassword,
      isFirstLogin: false,
    });

    return {
      message: 'Credentials updated successfully!',
    };
  }

  async verifyAdmin(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      if (payload?.type !== 'verify_admin')
        throw new UnauthorizedException('Invalid token type!');

      const admin = await this.usersRepository.findOne({
        where: { id: payload.sub },
      });
      if (!admin) throw new NotFoundException('Admin not found!');

      if (admin.isAdminActive) {
        throw new BadRequestException('Admin already verified!');
      }

      await this.usersRepository.update(
        { id: payload.sub },
        { isAdminActive: true },
      );

      return { message: 'Verification completed' };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token expired');
      }
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      }

      throw error;
    }
  }

  async refreshToken(userId: number): Promise<{ new_access_token: string }> {
    try {
      const existedUser = await this.usersService.findById(userId);
      if (!existedUser) throw new NotFoundException('User not found!');

      const userInfo: IuserInfo = {
        sub: existedUser.id,
        username: existedUser.username,
        email: existedUser.email,
        role: existedUser.role,
      };

      const new_access_token = await this.jwtService.signAsync(userInfo, {
        expiresIn: '1h',
      });

      return { new_access_token };
    } catch {
      throw new UnauthorizedException('Invalid');
    }
  }
}
