import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUsersDto {
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  username!: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;
}
