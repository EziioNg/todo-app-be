import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksEntity } from './tasks.entity';
import { TasksService } from './tasks.service';
import { UsersEntity } from 'src/auth/users/users.entity';
import { MailsModule } from '../mails/mails.module';
import { UsersModule } from 'src/auth/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TasksEntity, UsersEntity]),
    MailsModule,
    UsersModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
