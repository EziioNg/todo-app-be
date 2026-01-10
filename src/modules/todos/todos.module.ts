import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { TodosEntity } from './todos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TodosEntity])],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
