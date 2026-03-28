import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository, IsNull } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  async findById(userId: number): Promise<UsersEntity | null> {
    return this.usersRepository.findOne({ where: { id: userId } });
  }

  async findByName(username: string): Promise<UsersEntity | null> {
    return this.usersRepository.findOne({
      where: { username, deletedAt: IsNull() },
      relations: ['employeeProfile', 'employeeProfile.createdBy'],
    });
  }

  async findByEmail(email: string): Promise<UsersEntity | null> {
    return this.usersRepository.findOne({ where: { email } });
  }
}
