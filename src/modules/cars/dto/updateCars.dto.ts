import { PartialType } from '@nestjs/mapped-types';
import { CreateCarsDto } from './createCars.dto';

export class UpdateCarsDto extends PartialType(CreateCarsDto) {}
