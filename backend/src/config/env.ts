import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  JWT_SECRET: z.string().min(8, "JWT_SECRET must be at least 8 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),

  IMGBB_API_KEY: z.string().default(""),

  STORY_VIDEO_MAX_MB: z.coerce.number().default(32),
  UPLOAD_DIR: z.string().default("uploads"),

  IS_LIVE: z
    .string()
    .default("false")
    .transform((v) => v === "true"),
  SSLCOMMERZ_STORE_ID: z.string().default(""),
  SSLCOMMERZ_STORE_PASSWORD: z.string().default(""),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
  SERVER_URL: z.string().default("http://localhost:5000"),

  ADMIN_EMAIL: z.string().email().default("harirshadbogura@gmail.com"),
  ADMIN_PASSWORD: z.string().min(6).default("admin12345"),
  ADMIN_NAME: z.string().default("হাঁড়ির স্বাদ অ্যাডমিন"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    parsed.error.flatten().fieldErrors,
  );
  process.exit(1);
}

export const env = parsed.data;

export const isImgbbConfigured = () => env.IMGBB_API_KEY.length > 0;
export const isSslcommerzConfigured = () =>
  env.SSLCOMMERZ_STORE_ID.length > 0 && env.SSLCOMMERZ_STORE_PASSWORD.length > 0;
