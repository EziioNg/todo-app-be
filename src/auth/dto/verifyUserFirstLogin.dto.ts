import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyUserFirstLoginDto {
  @IsString()
  @IsNotEmpty({ message: 'Token is required!' })
  token!: string;
}
