import { IsString, IsNumber, Min } from 'class-validator';

export class CreateCarsDto {
  @IsString()
  productName: string;

  @IsNumber()
  category_id: number;

  @IsNumber()
  @Min(0)
  price: number;
}
