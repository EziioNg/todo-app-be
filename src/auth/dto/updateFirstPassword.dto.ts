import { IsNotEmpty, IsString } from 'class-validator';

export class updateFirstPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Token is required!' })
  token!: string;

  @IsString()
  @IsNotEmpty({ message: 'Email is required!' })
  user_email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Username is required!' })
  new_username!: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required!' })
  new_password!: string;
}
