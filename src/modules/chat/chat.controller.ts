import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/common/types/jwt-payload.type';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard)
  @Get('conversations')
  async getConversations(@CurrentUser() user: JwtPayload) {
    const userId = user.sub;

    return this.chatService.getConversations(userId);
  }

  @UseGuards(AuthGuard)
  @Get('messages/:conversationId')
  async getMessages(
    @Param('conversationId') conversationId: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const userId = user.sub;
    // console.log('userId from getMessages: ', userId);
    // console.log('conversationId from getMessages: ', conversationId);

    const result = await this.chatService.getMessages(conversationId, userId);
    return result;
  }
}
