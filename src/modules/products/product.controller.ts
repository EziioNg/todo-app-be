/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatusCode } from 'src/global/globalEnum';
import { Product } from 'src/models/product.model';
import { ProductDto } from 'src/modules/products/dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  // getAllProduct(): string {
  //   return this.productService.getAllProduct();
  // }
  getAllProduct(): ResponseData<Product[]> {
    try {
      return new ResponseData<Product[]>(
        this.productService.getAllProduct(),
        HttpStatusCode.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Product[]>(
        // error instanceof Error ? error.message : String(error),
        error,
        HttpStatusCode.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Get('/:id')
  // getDetails(): string {
  //   return this.productService.getDetails();
  // }
  getDetails(@Param('id') id: number): ResponseData<Product> {
    try {
      return new ResponseData<Product>(
        this.productService.getDetails(id),
        HttpStatusCode.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Product>(
        error,
        HttpStatusCode.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Post()
  // createProduct(): string {
  //   return this.productService.createProduct();
  // }
  createProduct(
    @Body(new ValidationPipe()) productDto: ProductDto,
  ): ResponseData<ProductDto> {
    try {
      return new ResponseData<Product>(
        this.productService.createProduct(productDto),
        HttpStatusCode.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Product>(
        error,
        HttpStatusCode.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Put('/:id')
  // updateProduct(): string {
  //   return this.productService.updateProduct();
  // }
  updateProduct(
    @Body() productDto: ProductDto,
    @Param('id') id: number,
  ): ResponseData<Product> {
    try {
      return new ResponseData<Product>(
        this.productService.updateProduct(productDto, id),
        HttpStatusCode.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Product>(
        error,
        HttpStatusCode.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Delete('/:id')
  // deleteProduct(): string {
  //   return this.productService.deleteProduct();
  // }
  deleteProduct(@Param('id') id: number): ResponseData<boolean> {
    try {
      return new ResponseData<boolean>(
        this.productService.deleteProduct(id),
        HttpStatusCode.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<boolean>(
        error,
        HttpStatusCode.ERROR,
        HttpMessage.ERROR,
      );
    }
  }
}
