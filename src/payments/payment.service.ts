import { Injectable } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import { PaymentException } from '../errors/payment.exception';
import { Stripe } from 'stripe';

@Injectable()
export class PaymentService {
  constructor(@InjectStripe() private readonly stripeClient: Stripe) {}

  async createCharge(amount: number, source: string): Promise<any> {
    try {
      const customer = await this.stripeClient.customers.create({
        source,
      });

      await this.stripeClient.charges.create({
        amount: amount * 100,
        currency: 'usd',
        customer: customer.id,
        description: 'Example charge',
      });

      // TODO: add jwt guard to payment controller and store info in database with id which is given to jwt playground
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
