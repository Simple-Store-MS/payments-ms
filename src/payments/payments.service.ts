import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';

import { envs } from '../config/envs';
import {
  CreatePaymentSessionDto,
  PaymentSessionItemDto,
} from './dtos/create-payment-session.dto';
import { parse } from 'path';

@Injectable()
export class PaymentsService {
  private readonly stripeClient = new Stripe(envs.stripeSecretKey);

  private readonly logger = new Logger(PaymentsService.name);

  public async createPaymentSession(
    dto: CreatePaymentSessionDto,
  ): Promise<Stripe.Checkout.Session> {
    const items = dto.items.map((item: PaymentSessionItemDto) => ({
      price_data: {
        currency: dto.currency,
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // 20 USD -> 2000 (cents)
      },
      quantity: item.quantity,
    }));

    const session = await this.stripeClient.checkout.sessions.create({
      mode: 'payment',
      success_url: envs.stripeSuccessUrl,
      cancel_url: envs.stripeCancelUrl,
      line_items: items,
      payment_intent_data: {
        metadata: {
          orderId: dto.orderId,
        },
      },
    });

    return session;
  }

  public handleStripeWebhook(input: {
    rawPayload: Buffer | string;
    signatureHeader: string | Buffer | Array<string>;
  }): void {
    const webhookSecret = envs.stripeWebhookSecret;
    const { rawPayload, signatureHeader } = input;

    let event: Stripe.Event;

    try {
      event = this.stripeClient.webhooks.constructEvent(
        rawPayload,
        signatureHeader,
        webhookSecret,
      );
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err}`);
    }

    const metadata = event.data.object['metadata'] as { orderId: string };
    this.logger.log(
      `Webhook event: ${event.type} received with metadata (${JSON.stringify(metadata)})`,
    );
  }
}
