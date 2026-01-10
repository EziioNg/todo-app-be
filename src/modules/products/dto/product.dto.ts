import { MinLength, IsNotEmpty, IsNumber } from 'class-validator';

export class ProductDto {
  @IsNotEmpty({ message: 'This field is required!' })
  categoryId?: number;

  @MinLength(5, { message: 'This field must be 5 characters!' })
  productName?: string;

  @IsNumber()
  price?: number;
}
