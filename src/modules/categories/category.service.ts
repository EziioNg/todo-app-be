/* eslint-disable @typescript-eslint/no-misused-promises */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesEntity } from './categories.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesEntity)
    private categoriesRepository: Repository<CategoriesEntity>,
  ) {}

  findAll(): Promise<CategoriesEntity[]> {
    const cars = this.categoriesRepository.find();

    if (!cars) throw new NotFoundException('Error getting categories');

    return cars;
  }

  findOne(id: number): Promise<CategoriesEntity | null> {
    const car = this.categoriesRepository.findOneBy({ id });

    if (!car) throw new NotFoundException('Category not found!');

    return car;
  }

  async remove(id: number): Promise<void> {
    await this.categoriesRepository.delete(id);
  }
}
