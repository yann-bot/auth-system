import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer } from "better-auth/plugins/bearer";
import db, { schema } from "../../../infrastructure/db";
import { emailSender } from "./console-email.adapter";
import { resetPasswordTemplate } from "./email-templates/reset-password.template";

const FRONTEND_URL =
  process.env.FRONTEND_URL ??
  process.env.BETTER_AUTH_URL ??
  "http://localhost:3000";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: (process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),

  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true,
    resetPasswordTokenExpiresIn: 60 * 60, // 1h
    sendResetPassword: async ({ user, token }) => {
      try {
        const resetUrl = `${FRONTEND_URL}/reset-password?token=${encodeURIComponent(token)}`;
        const message = resetPasswordTemplate({
          userName: user.name || user.email,
          resetUrl,
        });
        await emailSender.send({ to: user.email, ...message });
      } catch (err) {
        // Swallow to avoid leaking account existence via timing/error.
        console.error("[auth] sendResetPassword failed:", err);
      }
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 min
    },
  },

  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    storage: "memory",
  },

  plugins: [bearer()],
});

export type Auth = typeof auth;
