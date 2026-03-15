import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyAdminDto {
  @IsString()
  @IsNotEmpty({ message: 'Token is required!' })
  token!: string;
}
