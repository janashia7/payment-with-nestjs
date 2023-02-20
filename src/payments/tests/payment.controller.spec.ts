import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { StripeModule } from 'nestjs-stripe';
import { User } from 'src/user/user.model';
import { CreateChargeDto } from '../dto/create-charge.dto';
import { PaymentController } from '../payment.controller';
import { PaymentService } from '../payment.service';
import { config } from 'dotenv';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../../user/user.module';
import { AppModule } from '../../app.module';
import { PaymentException } from '../../errors/payment.exception';
import { CreateTokenDto } from '../dto/create-token.dto';
config();

describe('PaymentController', () => {
  let paymentController: PaymentController;
  let paymentService: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        UserModule,
        StripeModule.forRoot({
          apiKey: process.env.STRIPE_API_KEY,
          apiVersion: '2020-08-27',
        }),
        JwtModule.register({
          secret: 'test',
          signOptions: { expiresIn: '1d' },
        }),
      ],
      controllers: [PaymentController],
      providers: [PaymentService],
    }).compile();

    paymentController = module.get<PaymentController>(PaymentController);
    paymentService = module.get<PaymentService>(PaymentService);
  });

  describe('createCharge', () => {
    const createChargeDto: CreateChargeDto = {
      amount: 1000,
      source: 'tok_test',
    };

    const token = 'access_token';

    it('should create a new charge', async () => {
      const mockUser: User = {
        username: 'testuser',
        payments: [],
        password: 'testpassword',
      };

      jest
        .spyOn(paymentService, 'createCharge')
        .mockReturnValueOnce(Promise.resolve(mockUser));

      const result = await paymentController.createCharge(
        {
          user: { access_token: token },
        },
        createChargeDto,
      );

      expect(paymentService.createCharge).toBeCalledWith(
        createChargeDto,
        token,
      );

      expect(result).toEqual(mockUser);
    });

    it('should throw an exception when the payment service throws an error', async () => {
      const error = new Error('Payment service error');
      jest.spyOn(paymentService, 'createCharge').mockRejectedValueOnce(error);

      try {
        await paymentController.createCharge(
          { user: { access_token: token } },
          createChargeDto,
        );
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toEqual(error.message);
      }
    });
  });

  describe('createToken', () => {
    const createTokenDto: CreateTokenDto = {
      number: '4242424242424242',
      exp_month: '12',
      exp_year: '2023',
      cvc: '123',
    };

    it('should return a token', async () => {
      const mockToken = { token: 'tok_test' };

      jest.spyOn(paymentService, 'createToken').mockResolvedValue(mockToken);

      const result = await paymentController.createToken(createTokenDto);

      expect(paymentService.createToken).toBeCalledWith(createTokenDto);
      expect(result).toEqual(mockToken);
    });

    it('should throw an HttpException with status 409 when PaymentException is thrown', async () => {
      const errorMessage = 'Error creating token';

      jest
        .spyOn(paymentService, 'createToken')
        .mockRejectedValue(new PaymentException(errorMessage));

      try {
        await paymentController.createToken(createTokenDto);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.message).toEqual(errorMessage);
        expect(err.status).toEqual(HttpStatus.PAYMENT_REQUIRED);
      }
    });
  });
});
