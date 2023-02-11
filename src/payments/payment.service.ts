import { Injectable } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import { Stripe } from 'stripe';

@Injectable()
export class PaymentService {
  constructor(@InjectStripe() private readonly stripeClient: Stripe) {}

  async createCharge(amount: number, source: string): Promise<Stripe.Charge> {
    
    return this.stripeClient.charges.create({
      amount: amount * 100,
      currency: 'usd',
      source,
      description: 'Example charge',
    });
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
