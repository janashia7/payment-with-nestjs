import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import mongoose, { Model } from 'mongoose';
import { User } from '../../user/user.model';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';
import * as bcrypt from 'bcrypt';
import { AuthUserDto } from '../dto/auth.dto';
import { UserRepository } from '../../user/user.repository';
import { UserNotFoundException } from '../../errors/user.exception';

describe('AuthService', () => {
  let authService: AuthService;
  let userModel: Model<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        JwtService,
        UserRepository,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'jwtToken'),
          },
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    userModel = moduleRef.get<Model<User>>(getModelToken(User.name));
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should throw UserNotFoundException when user is not found', async () => {
      const user = {
        username: 'testuser',
        password: await bcrypt.hash('testpassword', 10),
      };

      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null);

      try {
        await authService.validateUser(user.username, user.password);
      } catch (error) {
        expect(error).toBeInstanceOf(UserNotFoundException);
        expect(error.message).toEqual(
          `User with username ${user.username} not found.`,
        );
      }
    });

    it('should return null if password is invalid', async () => {
      const user = {
        username: 'testuser',
        password: await bcrypt.hash('testpassword', 10),
      };
      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false as never);

      const result = await authService.validateUser(
        'testuser',
        'invalidpassword',
      );

      expect(result).toBeNull();
    });

    it('should return a user object if username and password are valid', async () => {
      const user = {
        username: 'testuser',
        password: await bcrypt.hash('testpassword', 10),
        id: new mongoose.Types.ObjectId(),
      };
      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as never);

      const result = await authService.validateUser(
        user.username,
        user.password,
      );

      expect(result).toEqual({
        id: user.id,
        username: user.username,
      });
    });
  });

  describe('login', () => {
    const user: AuthUserDto = {
      username: 'testuser',
      id: '123',
    };

    it('should return jwt token', async () => {
      const result = await authService.login(user);

      expect(result).toEqual({
        access_token: 'jwtToken',
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: user.username,
        sub: user.id,
      });
    });
  });
});
