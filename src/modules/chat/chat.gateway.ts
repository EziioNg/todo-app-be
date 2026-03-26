import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { WsAuthGuard } from './ws.guard';
import { NewMessagesDto } from './dto/newMessages.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import type { AuthenticatedSocket } from 'src/common/types/socket-auth.type';
import { WsRolesGuard } from './wsRoles.guard';
import { env } from 'src/config/env';

// @WebSocketGateway({ cors: { origin: '*' } })
@WebSocketGateway({
  cors: {
    origin: env.WEBSITE_DOMAIN,
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    const userId = client.id;
    // console.log('Client connected...: ', userId);
    // console.log('id type: ', typeof userId);

    this.server.emit('user-joined', {
      message: `New user joined: ${userId}`,
    });
  }

  handleDisconnect(client: Socket) {
    const userId = client.id;
    // console.log(`Client disconnected...: ${client.id}`);

    this.server.emit('user-left', {
      message: `New user left: ${userId}`,
    });
  }

  @UseGuards(WsAuthGuard, WsRolesGuard)
  @Roles('admin')
  @SubscribeMessage('create_conversation')
  async handleCreateConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: { employeeId: number; employeeName: string },
  ) {
    const adminId = client.data.user.sub;
    // console.log('adminId: ', adminId);

    const employeeId = payload.employeeId;
    // console.log('emp id: ', employeeId);
    const employeeName = payload.employeeName;
    // console.log('emp name from gateway: ', employeeName);

    const conversation = await this.chatService.createConversation(
      adminId,
      employeeId,
      employeeName,
    );
    // console.log('conversation: ', conversation);

    if (!conversation) {
      throw new Error('Conversation not created');
    }

    await client.join(`conversation_${conversation.id}`);
    client.emit('conversation_created', conversation);

    return {
      message: 'Conversation created!',
      // event: 'conversation_created',
      // data: conversation,
    };
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('join_conversation')
  async handleJoinConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: { conversationId: number },
  ) {
    const userId = client.data.user.sub;
    const { conversationId } = payload;
    // console.log('userId from join_conversation: ', userId);
    // console.log('conversationId from join_conversation: ', conversationId);
    // console.log(`User ${userId} joining conversation ${conversationId}`);

    const isParticipant = await this.chatService.isUserInConversation(
      userId,
      conversationId,
    );

    if (!isParticipant) {
      client.emit('error', 'Access denied to this conversation');
      return;
    }

    await client.join(`conversation_${conversationId}`);

    const messages = await this.chatService.getMessages(conversationId, userId);
    client.emit('conversation_messages', messages);

    // console.log(`User ${userId} joined room conversation_${conversationId}`);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: NewMessagesDto,
  ) {
    const userId = client.data.user.sub;

    const message = await this.chatService.createMessage(data, userId);
    // console.log('message created: ', message);

    this.server
      .to(`conversation_${data.conversationId}`)
      .emit('new_message', message);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('leave_conversation')
  async handleLeaveConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: { conversationId: number },
  ) {
    const userId = client.data.user.sub;

    const { conversationId } = payload;
    // console.log('userId from leave_conversation: ', userId);
    // console.log('conversationId from leave_conversation: ', conversationId);
    // console.log(`User ${userId} leaving conversation ${conversationId}`);

    const isParticipant = await this.chatService.isUserInConversation(
      userId,
      conversationId,
    );

    if (!isParticipant) {
      client.emit('error', 'Access denied to this conversation');
      return;
    }

    await client.leave(`conversation_${conversationId}`);

    // console.log(`User ${userId} left room conversation_${conversationId}`);
  }
}
