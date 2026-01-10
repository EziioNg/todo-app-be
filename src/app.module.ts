import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './modules/products/product.module';
import { CarsModule } from './modules/cars/cars.module';
import { CarsEntity } from './modules/cars/cars.entity';
import { CategoriesEntity } from './modules/categories/categories.entity';
import { CategoriesModule } from './modules/categories/category.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './auth/users/users.module';
import { TodosModule } from './modules/todos/todos.module';
import { TodosEntity } from './modules/todos/todos.entity';
import { UsersEntity } from './auth/users/users.entity';

@Module({
  imports: [
    TodosModule,
    CarsModule,
    CategoriesModule,
    ProductModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'nestjs-pj1',
      entities: [CarsEntity, CategoriesEntity, TodosEntity, UsersEntity],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
