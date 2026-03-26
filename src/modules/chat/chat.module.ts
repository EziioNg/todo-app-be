import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/auth/users/users.module';
import { EmployeesModule } from '../employees/employees.module';
import { UsersEntity } from 'src/auth/users/users.entity';
import { EmployeesEntity } from '../employees/employees.entity';
import { ConversationEntity } from './conversations.entity';
import { MessageEntity } from './messages.entity';
import { ParticipantEntity } from './participants.entity';
import { ChatController } from './chat.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConversationEntity,
      MessageEntity,
      ParticipantEntity,
      UsersEntity,
      EmployeesEntity,
    ]),
    UsersModule,
    EmployeesModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
