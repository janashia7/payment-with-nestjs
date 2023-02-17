import { Injectable } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import { PaymentException } from '../errors/payment.exception';
import { Stripe } from 'stripe';
import { JwtService } from '@nestjs/jwt';
import { config } from 'dotenv';
import { UserService } from '../user/user.service';
config();

@Injectable()
export class PaymentService {
  constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async createCharge(
    amount: number,
    source: string,
    token: string,
  ): Promise<any> {
    try {
      const customer = await this.stripeClient.customers.create({
        source,
      });

      const {
        customer: cus,
        currency,
        paid,
        payment_method_details: {
          card: { brand, country, last4 },
          type,
        },
        receipt_url,
      } = await this.stripeClient.charges.create({
        amount: amount * 100,
        currency: 'usd',
        customer: customer.id,
        description: 'Example charge',
      });

      const date = new Date();

      const paymentInfo = {
        cus,
        amount,
        currency,
        paid,
        type,
        brand,
        country,
        last4,
        receipt_url,
        date,
      };

      const { username } = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      return await this.userService.addUserPayment(username, paymentInfo);
    } catch (err) {
      throw new PaymentException(err.message);
    }
  }

  async createToken(
    number: string,
    exp_month: string,
    exp_year: string,
    cvc: string,
  ): Promise<string> {
    const token = await this.stripeClient.tokens.create({
      card: {
        number,
        exp_month,
        exp_year,
        cvc,
      },
    });

    return token.id;
  }
}
