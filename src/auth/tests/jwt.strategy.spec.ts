import { UnauthorizedException } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtStrategy } from './../strategies/jwt.strategy';
describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    jwtStrategy = moduleRef.get<JwtStrategy>(JwtStrategy);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('validate', () => {
    const user = { username: 'testuser', id: '123' };

    it('should return an access token if user is valid', async () => {
      const payload = { id: user.id, username: user.username };
      const token = 'testtoken';

      jest
        .spyOn(authService, 'login')
        .mockResolvedValueOnce({ access_token: token });

      const result = await jwtStrategy.validate(payload);

      expect(result.access_token).toEqual(token);
    });

    it('should throw an UnauthorizedException if user is not valid', async () => {
      const payload = { id: user.id, username: user.username };

      jest.spyOn(authService, 'login').mockResolvedValueOnce(null);

      try {
        await jwtStrategy.validate(payload);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toEqual(`Unauthorized`);
      }
    });
  });
});
