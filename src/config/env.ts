import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'production']),

  PORT: z.coerce.number(),

  DATABASE_URL: z.string().optional(),

  DATABASE_HOST: z.string().optional(),
  DATABASE_PORT: z.coerce.number().optional(),

  DATABASE_NAME: z.string().optional(),
  DATABASE_USER: z.string().optional(),
  DATABASE_PASSWORD: z.string().optional(),

  WEBSITE_DOMAIN: z.string(),

  RESEND_API_KEY: z.string(),
  RESEND_ADMIN_SENDER_EMAIL: z.string().email(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables');
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
