import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  async create(data: Partial<UsersEntity>): Promise<UsersEntity> {
    return this.usersRepository.save(data);
  }

  async findByEmail(email: string): Promise<UsersEntity | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByName(username: string): Promise<UsersEntity | null> {
    return this.usersRepository.findOne({ where: { username } });
  }
}
