import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './auth/users/users.module';
import { UsersEntity } from './auth/users/users.entity';
import { TodosModule } from './modules/todos/todos.module';
import { TodosEntity } from './modules/todos/todos.entity';
import { EmployeesModule } from './modules/employees/employees.module';
import { EmployeesEntity } from './modules/employees/employees.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'nestjs-pj1',
      entities: [TodosEntity, UsersEntity, EmployeesEntity],
      synchronize: true,
      // username: 'nestjs',
      // password: 'Aa@123',
      // database: 'nestjs_pj1',
      // entities: [TodosEntity, UsersEntity],
      // synchronize: false,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local', '.env.development.production'],
    }),
    TodosModule,
    AuthModule,
    UsersModule,
    EmployeesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
