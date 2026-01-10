/* eslint-disable @typescript-eslint/no-misused-promises */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarsEntity } from './cars.entity';
import { Repository } from 'typeorm';
import { CreateCarsDto } from './dto/createCars.dto';
import { UpdateCarsDto } from './dto/updateCars.dto';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(CarsEntity)
    private carsRepository: Repository<CarsEntity>,
  ) {}

  findAll(): Promise<CarsEntity[]> {
    const cars = this.carsRepository.find();

    if (!cars) throw new NotFoundException('Error getting cars');

    return cars;
  }

  async findOne(id: number): Promise<CarsEntity | null> {
    const car = await this.carsRepository.findOneBy({ id });

    if (!car) throw new NotFoundException('Car not found');

    return car;
  }

  createCar(data: CreateCarsDto): Promise<CarsEntity> {
    const car = this.carsRepository.create(data);
    const createdCar = this.carsRepository.save(car);
    return createdCar;
  }

  async updateCar(data: UpdateCarsDto, id: number): Promise<CarsEntity> {
    const car = await this.carsRepository.findOneBy({ id });
    if (!car) throw new NotFoundException('Car not found');

    const updated = this.carsRepository.merge(car, data);
    const updatedCar = this.carsRepository.save(updated);

    return updatedCar;
  }

  async deleteCar(id: number): Promise<void> {
    const result = await this.carsRepository.delete(id);

    if (result.affected === 0) throw new NotFoundException('Car not found');
  }
}
