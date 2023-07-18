import { IsNotEmpty } from 'class-validator';

export class UpdateAuthDto {
  @IsNotEmpty()
  _id: string;

  @IsNotEmpty()
  password: string;

  token: string;
}
