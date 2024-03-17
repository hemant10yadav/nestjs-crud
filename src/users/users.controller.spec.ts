import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RestUser } from './RestUser';
import { NotFoundException } from '@nestjs/common';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockReturnValue([]),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', () => {
      const users: User[] = [
        { id: '1', username: 'user1', age: 25, hobbies: ['reading'] },
        { id: '2', username: 'user2', age: 30, hobbies: ['cooking'] },
      ];
      service.findAll = jest.fn().mockReturnValue(users);

      const result = controller.findAll();

      expect(result).toEqual(users);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user if found', () => {
      const user: User = {
        id: '1',
        username: 'user1',
        age: 25,
        hobbies: ['reading'],
      };
      service.findOne = jest.fn().mockReturnValue(user);

      const result = controller.findOne('1');

      expect(result).toEqual(user);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if user not found', () => {
      service.findOne = jest.fn().mockReturnValue(undefined);

      expect(() => controller.findOne('1')).toThrowError(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new user', () => {
      const restUser: RestUser = {
        username: 'user1',
        age: 25,
        hobbies: ['reading'],
      };
      const user: User = {
        id: '1',
        username: 'user1',
        age: 25,
        hobbies: ['reading'],
      };
      service.create = jest.fn().mockReturnValue(user);

      const result = controller.create(restUser);

      expect(result).toEqual(user);
      expect(service.create).toHaveBeenCalledWith(restUser);
    });
  });

  describe('update', () => {
    it('should update a user if found', () => {
      const restUser: RestUser = {
        username: 'updateduser',
        age: 30,
        hobbies: ['coding'],
      };
      const user: User = {
        id: '1',
        username: 'updateduser',
        age: 30,
        hobbies: ['coding'],
      };
      service.update = jest.fn().mockReturnValue(user);

      const result = controller.update('1', restUser);

      expect(result).toEqual(user);
      expect(service.update).toHaveBeenCalledWith('1', restUser);
    });

    it('should throw NotFoundException if user not found', () => {
      const restUser: RestUser = {
        username: 'updateduser',
        age: 30,
        hobbies: ['coding'],
      };
      service.update = jest.fn().mockReturnValue(undefined);

      expect(() => controller.update('1', restUser)).toThrowError(
        NotFoundException,
      );
      expect(service.update).toHaveBeenCalledWith('1', restUser);
    });
  });

  describe('remove', () => {
    it('should delete a user if found', () => {
      const user: User = {
        id: '1',
        username: 'user1',
        age: 25,
        hobbies: ['reading'],
      };
      service.remove = jest.fn().mockReturnValue(user);

      const result = controller.remove('1');

      expect(result).toEqual(user);
      expect(service.remove).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if user not found', () => {
      service.remove = jest.fn().mockReturnValue(undefined);

      expect(() => controller.remove('1')).toThrowError(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
