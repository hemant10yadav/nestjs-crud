import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [];

  public findAll(): User[] {
    return this.users;
  }

  public findOne(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  public create(user: Omit<User, 'id'>): User {
    const newUser = new User(user);
    this.users.push(newUser);
    return newUser;
  }

  public update(id: string, user: Partial<User>): User | undefined {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex !== -1) {
      const updatedUser = new User({ ...this.users[userIndex], ...user });
      this.users[userIndex] = updatedUser;
      return updatedUser;
    }
    return undefined;
  }

  public remove(id: string): User | undefined {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
      const deletedUser = this.users[userIndex];
      this.users.splice(userIndex, 1);
      return deletedUser;
    }
    return undefined;
  }
}
