import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  NATS_SERVERS: string[];
  PORT: number;
  STRIPE_CANCEL_URL: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_SUCCESS_URL: string;
  STRIPE_WEBHOOK_SECRET: string;
}

const envsSchema = joi
  .object({
    NATS_SERVERS: joi.array().items(joi.string()).required(),
    PORT: joi.number().required(),
    STRIPE_CANCEL_URL: joi.string().uri().required(),
    STRIPE_SECRET_KEY: joi.string().required(),
    STRIPE_SUCCESS_URL: joi.string().uri().required(),
    STRIPE_WEBHOOK_SECRET: joi.string().required(),
  })
  .unknown(true);

const result = envsSchema.validate({
  ...process.env,
  NATS_SERVERS:
    process.env.NATS_SERVERS?.split(',').map((server: string) =>
      server.trim(),
    ) || [],
});

if (result.error) {
  throw new Error(`Config validations error ${result.error.message}`);
}

const envVars = result.value as EnvVars;

export const envs = {
  natsServers: envVars.NATS_SERVERS,
  port: envVars.PORT,
  stripeCancelUrl: envVars.STRIPE_CANCEL_URL,
  stripeSecretKey: envVars.STRIPE_SECRET_KEY,
  stripeSuccessUrl: envVars.STRIPE_SUCCESS_URL,
  stripeWebhookSecret: envVars.STRIPE_WEBHOOK_SECRET,
};
