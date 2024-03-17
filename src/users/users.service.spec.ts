import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    service['users'] = [];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', () => {
    const userData = {
      username: 'testuser',
      age: 25,
      hobbies: ['reading', 'coding'],
    };
    const newUser = service.create(userData);

    expect(newUser).toBeInstanceOf(User);
    expect(newUser.username).toBe('testuser');
    expect(newUser.age).toBe(25);
    expect(newUser.hobbies).toEqual(['reading', 'coding']);
    expect(service.findAll().length).toBe(1);
  });

  it('should find all users', () => {
    const user1 = service.create({
      username: 'user1',
      age: 30,
      hobbies: ['painting'],
    });
    const user2 = service.create({
      username: 'user2',
      age: 25,
      hobbies: ['cooking', 'hiking'],
    });

    const users = service.findAll();
    expect(users.length).toBe(2);
    expect(users).toContainEqual(user1);
    expect(users).toContainEqual(user2);
  });

  it('should find a user by id', () => {
    const userData = {
      username: 'testuser',
      age: 25,
      hobbies: ['reading', 'coding'],
    };
    const newUser = service.create(userData);

    const foundUser = service.findOne(newUser.id);
    expect(foundUser).toBe(newUser);
  });

  it('should update a user', () => {
    const userData = {
      username: 'testuser',
      age: 25,
      hobbies: ['reading', 'coding'],
    };
    const newUser = service.create(userData);

    const updatedUser = service.update(newUser.id, {
      username: 'updateduser',
      age: 30,
    });
    expect(updatedUser).toBeDefined();
    expect(updatedUser.username).toBe('updateduser');
    expect(updatedUser.age).toBe(30);
    expect(updatedUser.hobbies).toEqual(['reading', 'coding']);
  });

  it('should not update a non-existing user', () => {
    const updatedUser = service.update('nonexistingid', {
      username: 'updateduser',
      age: 30,
    });
    expect(updatedUser).toBeUndefined();
  });

  it('should delete a user', () => {
    const userData = {
      username: 'testuser',
      age: 25,
      hobbies: ['reading', 'coding'],
    };
    const newUser = service.create(userData);

    const deletedUser = service.remove(newUser.id);
    expect(deletedUser).toBe(newUser);
    expect(service.findAll().length).toBe(0);
  });

  it('should not delete a non-existing user', () => {
    const deletedUser = service.remove('nonexistingid');
    expect(deletedUser).toBeUndefined();
  });
});
