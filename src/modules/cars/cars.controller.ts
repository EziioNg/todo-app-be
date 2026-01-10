import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import express from 'express';
import { CarsService } from './cars.service';
import { CreateCarsDto } from './dto/createCars.dto';
// import { ResponseData } from 'src/global/globalClass';
// import { CarResponseDto } from './dto/carsResponse.dto';
// import { HttpMessage, HttpStatusCode } from 'src/global/globalEnum';
import { UpdateCarsDto } from './dto/updateCars.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() request: express.Request) {
    console.log('cookie received from request: ', request.cookies);
    return this.carsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.carsService.findOne(id);
  }

  // @Post()
  // async createCar(
  //   @Body(new ValidationPipe()) body: CreateCarsDto,
  // ): Promise<ResponseData<CarResponseDto>> {
  //   const createdCar = this.carsService.createCar(body);

  //   return new ResponseData<CarResponseDto>(
  //     await createdCar,
  //     HttpStatusCode.SUCCESS,
  //     HttpMessage.SUCCESS,
  //   );
  // }

  @Post()
  async createCar(@Body(new ValidationPipe()) body: CreateCarsDto) {
    return this.carsService.createCar(body);
  }

  // @Put(':id')
  // async updateCar(
  //   @Body(new ValidationPipe()) body: UpdateCarsDto,
  //   @Param('id') id: number,
  // ): Promise<ResponseData<CarResponseDto>> {
  //   const updatedCar = this.carsService.updateCar(body, id);

  //   return new ResponseData<CarResponseDto>(
  //     await updatedCar,
  //     HttpStatusCode.SUCCESS,
  //     HttpMessage.SUCCESS,
  //   );
  // }

  @Put(':id')
  async updateCar(
    @Body(new ValidationPipe()) body: UpdateCarsDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.carsService.updateCar(body, id);
  }

  // @Delete(':id')
  // async remove(
  //   @Param('id', ParseIntPipe) id: number,
  // ): Promise<ResponseData<null>> {
  //   await this.carsService.deleteCar(id);

  //   return new ResponseData<null>(
  //     null,
  //     HttpStatusCode.SUCCESS,
  //     HttpMessage.SUCCESS,
  //   );
  // }
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.carsService.deleteCar(id);
  }
}
