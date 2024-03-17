import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RestUser {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNumber()
  @IsNotEmpty()
  age: number;

  @IsArray()
  hobbies: string[];
}
