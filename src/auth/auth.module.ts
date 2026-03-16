import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/auth/users/users.module';
import { jwtConstants } from '../utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './users/users.entity';
import { MailsModule } from 'src/modules/mails/mails.module';

@Module({
  imports: [
    MailsModule,
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
    }),
    TypeOrmModule.forFeature([UsersEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
