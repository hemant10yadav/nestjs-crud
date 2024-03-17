import { Injectable, Logger } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private users: User[] = [];

  public findAll(): User[] {
    try {
      this.logger.log(`fetching all users...`);
      return this.users;
    } catch (error) {
      this.logger.error(`Error while fetching all users... ${error}`);
    }
  }

  public findOne(id: string): User | undefined {
    try {
      this.logger.log(`fetching user... ${id}`);
      return this.users.find((user) => user.id === id);
    } catch (error) {
      this.logger.error(`Error while fetching  user... ${error}`);
    }
  }

  public create(user: Omit<User, 'id'>): User {
    try {
      const newUser = new User(user);
      this.users.push(newUser);
      this.logger.log(`creating user... ${user}`);
      return newUser;
    } catch (error) {
      this.logger.error(`Error while creating  user... ${error}`);
    }
  }

  public update(id: string, user: Partial<User>): User | undefined {
    try {
      const userIndex = this.users.findIndex((u) => u.id === id);
      if (userIndex !== -1) {
        const updatedUser = new User({ ...this.users[userIndex], ...user });
        this.users[userIndex] = updatedUser;
        this.logger.log(`updating user... ${id}`);
        return updatedUser;
      }
      return undefined;
    } catch (error) {
      this.logger.error(`Error while updating user... ${error}`);
    }
  }

  public remove(id: string): User | undefined {
    try {
      const userIndex = this.users.findIndex((user) => user.id === id);
      if (userIndex !== -1) {
        const deletedUser = this.users[userIndex];
        this.users.splice(userIndex, 1);
        this.logger.log(`deleting user... ${id}`);
        return deletedUser;
      }
      return undefined;
    } catch (error) {
      this.logger.error(`Error while removing user... ${error}`);
    }
  }
}
