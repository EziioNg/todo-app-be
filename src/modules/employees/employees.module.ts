import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesController } from './employees.controller';
import { EmployeesEntity } from './employees.entity';
import { EmployeesService } from './employees.service';
import { UsersEntity } from 'src/auth/users/users.entity';
import { MailsModule } from '../mails/mails.module';
import { UsersModule } from 'src/auth/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployeesEntity, UsersEntity]),
    MailsModule,
    UsersModule,
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
