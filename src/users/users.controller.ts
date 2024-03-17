import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { RestUser } from './RestUser';
import { Logger } from '@nestjs/common';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): User[] {
    this.logger.log(`Retrieve all users`);
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): User {
    const user = this.usersService.findOne(id);
    if (!user) {
      this.logger.error(`User with id ${id} not found`);
      throw new NotFoundException(`User with id ${id} not found`);
    }
    this.logger.log(`Retrieve user with id: ${id}`);
    return user;
  }

  @Post()
  create(@Body() restUser: RestUser): User {
    this.logger.log(`created user  ${restUser}`);
    return this.usersService.create(restUser);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() restUser: RestUser): User {
    const updatedUser = this.usersService.update(id, restUser);
    if (!updatedUser) {
      this.logger.error(`User with id ${id} not found`);
      throw new NotFoundException(`User with id ${id} not found`);
    }
    this.logger.log(`updated user with id: ${id}`);
    return updatedUser;
  }

  @Delete(':id')
  remove(@Param('id') id: string): User {
    const deletedUser = this.usersService.remove(id);
    if (!deletedUser) {
      this.logger.error(`User with id ${id} not found`);
      throw new NotFoundException(`User with id ${id} not found`);
    }
    this.logger.log(`Deleted user with id: ${id}`);
    return deletedUser;
  }
}
