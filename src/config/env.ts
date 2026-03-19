import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'production']),

  PORT: z.coerce.number(),

  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.coerce.number(),

  DATABASE_NAME: z.string(),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),

  WEBSITE_DOMAIN: z.string(),

  RESEND_API_KEY: z.string(),
  RESEND_ADMIN_SENDER_EMAIL: z.string().email(),

  DATABASE_URL: z.string(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables');
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
