import { v4 as uuidv4 } from 'uuid';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class User {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNumber()
  @IsNotEmpty()
  age: number;

  @IsArray()
  @IsNotEmpty()
  hobbies: string[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
    this.id = uuidv4();
  }
}
