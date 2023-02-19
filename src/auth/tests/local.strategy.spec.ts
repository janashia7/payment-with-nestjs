import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import { AuthService } from '../auth.service';
import { AuthUserDto } from '../dto/auth.dto';
import { LocalStrategy } from '../strategies/local.strategy';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    localStrategy = moduleRef.get<LocalStrategy>(LocalStrategy);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('validate', () => {
    it('should return an AuthUserDto object if user is valid', async () => {
      // Arrange
      const username = 'testuser';
      const password = 'testpassword';
      const user: AuthUserDto = {
        id: '1',
        username,
      };
      jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(user);

      // Act
      const result = await localStrategy.validate(username, password);

      // Assert
      expect(result).toBe(user);
      expect(authService.validateUser).toHaveBeenCalledWith(username, password);
    });

    it('should throw an UnauthorizedException if user is not valid', async () => {
      const user = {
        username: 'testuser',
        password: 'testpassword',
      };

      jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(null);

      try {
        await localStrategy.validate(user.username, user.password);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toEqual(`Unauthorized`);
      }
    });
  });
});
