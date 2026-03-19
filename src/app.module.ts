import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './auth/users/users.module';
import { TodosModule } from './modules/todos/todos.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { env } from './config/env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env' : '.env.production',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(env.DATABASE_URL
        ? {
            url: env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
            extra: { max: 5 },
          }
        : {
            host: env.DATABASE_HOST,
            port: Number(env.DATABASE_PORT),
            username: env.DATABASE_USER,
            password: env.DATABASE_PASSWORD,
            database: env.DATABASE_NAME,
          }),
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV === 'dev',
    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: env.DATABASE_HOST,
    //   port: env.DATABASE_PORT,
    //   username: env.DATABASE_USER,
    //   password: env.DATABASE_PASSWORD,
    //   database: env.DATABASE_NAME,
    //   entities: [TodosEntity, UsersEntity, EmployeesEntity, TasksEntity],
    //   synchronize: true, // local
    //   // synchronize: false, // prod
    // }),
    TodosModule,
    AuthModule,
    UsersModule,
    EmployeesModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
