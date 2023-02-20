import { AppModule } from './../../app.module';
import { UserModule } from './../../user/user.module';
import { JwtService } from '@nestjs/jwt';
import { TestingModule, Test } from '@nestjs/testing';
import { User } from 'src/user/user.model';
import { UserService } from '../../user/user.service';
import Stripe from 'stripe';
import { CreateChargeDto } from '../dto/create-charge.dto';
import { PaymentService } from '../payment.service';
import { config } from 'dotenv';
import { StripeModule } from 'nestjs-stripe';
config();

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let jwtService: JwtService;
  let userService: UserService;
  let stripeClient: Stripe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        UserModule,
        StripeModule.forRoot({
          apiKey: process.env.STRIPE_API_KEY,
          apiVersion: '2020-08-27',
        }),
      ],
      providers: [
        PaymentService,
        JwtService,
        {
          provide: Stripe,
          useValue: {
            customers: {
              create: jest.fn(),
            },
            charges: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    paymentService = module.get<PaymentService>(PaymentService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
    stripeClient = module.get<Stripe>(Stripe);
  });

  describe('createCharge', () => {
    it('should create a charge and add the payment to the user account', async () => {
      const mockUser: User = {
        username: 'testuser',
        payments: [],
        password: 'testpassword',
      };

      const createChargeDto: CreateChargeDto = {
        amount: 100,
        source: 'tok_visa',
      };

      const customer = {
        id: 'cus_123',
      } as unknown as Stripe.Response<Stripe.Customer>;

      const charge = {
        customer: 'cus_123',
        currency: 'usd',
        paid: true,
        payment_method_details: {
          card: {
            brand: 'visa',
            country: 'US',
            last4: '4242',
          },
          type: 'card',
        },
        receipt_url: 'https://example.com/receipt',
      } as Stripe.Response<Stripe.Charge>;

      const token = 'test-token';
      const username = 'test-user';

      const jwtServiceVerifySpy = jest
        .spyOn(jwtService, 'verify')
        .mockReturnValue({ username });
      jest.spyOn(stripeClient.customers, 'create').mockResolvedValue(customer);

      jest.spyOn(stripeClient.charges, 'create').mockResolvedValue(charge);

      jest.spyOn(userService, 'addUserPayment').mockResolvedValue(mockUser);

      const result = await paymentService.createCharge(createChargeDto, token);

      expect(jwtServiceVerifySpy).toHaveBeenCalledWith(token, {
        secret: process.env.JWT_SECRET,
      });

      expect(result).toBe(mockUser);
    });
  });
});
