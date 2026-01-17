import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUsers {
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
