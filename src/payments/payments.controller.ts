import { Body, Controller, Get, Logger, Post, Req } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentsService } from './payments.service';
import { CreatePaymentSessionDto } from './dtos/create-payment-session.dto';
import { Request } from 'express';

@Controller('payments')
export class PaymentsController {
  private logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('cancel')
  public paymentCancel() {
    return 'paymentCancel';
  }

  @Post('')
  public createPaymentSession(
    @Body() dto: CreatePaymentSessionDto,
  ): Promise<Stripe.Checkout.Session> {
    return this.paymentsService.createPaymentSession(dto);
  }

  @Post('stripe-webhook')
  public stripePaymentWebhook(@Req() req: Request) {
    this.paymentsService.handleStripeWebhook({
      rawPayload: req['rawBody'] as Buffer | string,
      signatureHeader: req.header('stripe-signature') ?? 'no-signature-found',
    });

    return { received: true };
  }

  @Get('success')
  public paymentSuccess() {
    return 'paymentSuccess';
  }
}
