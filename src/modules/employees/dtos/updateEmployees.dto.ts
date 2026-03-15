import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeesDto } from './createEmployees.dto';

export class UpdateEmployeesDto extends PartialType(CreateEmployeesDto) {}
