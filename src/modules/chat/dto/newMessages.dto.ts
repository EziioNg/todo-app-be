import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class NewMessagesDto {
  @IsNotEmpty({ message: 'Conversation id is required!' })
  @IsNumber()
  conversationId!: number;

  @IsNotEmpty({ message: 'senderName is required' })
  @IsString()
  senderName!: string;

  @IsNotEmpty({ message: 'Chat content is required' })
  @IsString()
  content!: string;
}
