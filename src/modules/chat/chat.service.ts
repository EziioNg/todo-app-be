import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersEntity } from 'src/auth/users/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ParticipantEntity } from './participants.entity';
import { ConversationEntity } from './conversations.entity';
import { MessageEntity } from './messages.entity';
import { NewMessagesDto } from './dto/newMessages.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
    @InjectRepository(ParticipantEntity)
    private participantRepository: Repository<ParticipantEntity>,
    @InjectRepository(ConversationEntity)
    private conversationRepository: Repository<ConversationEntity>,
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
  ) {}

  async getConversations(userId: number) {
    const participants = await this.participantRepository.find({
      where: { userId },
    });

    const conversationIds = participants.map((p) => p.conversationId);

    if (!conversationIds.length) return [];

    const conversations = await this.conversationRepository.find({
      where: {
        id: In(conversationIds),
      },
      relations: {
        participants: {
          user: true,
        },
      },
    });

    const result = await Promise.all(
      conversations.map(async (conv) => {
        const otherParticipant = conv.participants.find(
          (p) => p.userId !== userId,
        );

        // lấy last message
        const lastMessage = await this.messageRepository.findOne({
          where: { conversationId: conv.id },
          order: { createdAt: 'DESC' },
        });

        return {
          id: conv.id,
          participant: {
            id: otherParticipant?.user.id,
            username: otherParticipant?.user.username,
          },
          lastMessage: lastMessage
            ? {
                content: lastMessage.content,
                createdAt: lastMessage.createdAt,
              }
            : null,
        };
      }),
    );

    return result;
  }

  async createConversation(
    adminId: number,
    employeeId: number,
    employeeName: string,
  ) {
    const employee = await this.userRepository.findOne({
      where: {
        id: employeeId,
        username: employeeName,
      },
    });
    if (!employee) throw new NotFoundException('Employee not found');
    const employeeUserId = employee.id;
    // console.log('raw employee name: ', employeeName);
    // console.log('employeeUserId: ', employeeUserId);
    // console.log('emp name from service: ', employee.username);

    const participants = await this.participantRepository.find({
      where: [{ userId: adminId }, { userId: employeeUserId }],
    });
    // console.log('participants:', participants);

    const map = new Map<number, Set<number>>();

    participants.forEach((p) => {
      if (!map.has(p.conversationId)) {
        map.set(p.conversationId, new Set());
      }
      map.get(p.conversationId)!.add(p.userId);
    });

    const existingConversationId = [...map.entries()].find(
      ([_, users]) => users.size === 2,
    )?.[0];

    if (existingConversationId) {
      return this.conversationRepository.findOne({
        where: { id: existingConversationId },
      });
    }

    const conversation = await this.conversationRepository.save({});

    await this.participantRepository.save([
      { userId: adminId, conversationId: conversation.id },
      { userId: employeeUserId, conversationId: conversation.id },
    ]);

    return conversation;
  }

  async isUserInConversation(userId: number, conversationId: number) {
    const participant = await this.participantRepository.findOne({
      where: {
        userId,
        conversationId,
      },
    });

    return participant;
  }

  async getMessages(conversationId: number, userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) throw new NotFoundException('User not found!');

    return this.messageRepository.find({
      where: { conversationId },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
  }

  async createMessage(data: NewMessagesDto, userId: number) {
    // console.log('message data: ', data);

    const newMessage = await this.messageRepository.save({
      conversationId: data.conversationId,
      content: data.content,
      senderId: userId,
      senderName: data.senderName,
    });

    return newMessage;
  }
}
