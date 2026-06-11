/**
 * Email dispatch abstraction.
 *
 * In development, this logs the email to console. In production,
 * swap the `send` implementation for nodemailer / SendGrid / SES.
 *
 * The env config should eventually carry SMTP_* or SENDGRID_API_KEY
 * etc. For now, the logger transport is enough for the reset-password
 * flow to be end-to-end visible.
 */
import { logger } from "@config/logger";
import { env } from "@config/env";

export interface EmailPayload {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

async function sendDev(payload: EmailPayload): Promise<void> {
  logger.info(
    {
      event: "email.dispatch.dev",
      to: payload.to,
      subject: payload.subject,
    },
    `[EMAIL] To: ${payload.to} | Subject: ${payload.subject}\n${payload.text}`,
  );
}

async function sendProd(payload: EmailPayload): Promise<void> {
  // TODO[prod-email]: integrate with nodemailer / SendGrid / SES.
  // The env would need SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS
  // or SENDGRID_API_KEY. Until then, fall back to the dev logger so
  // email delivery never silently drops.
  logger.warn(
    { event: "email.dispatch.prod.miss" },
    "[EMAIL] Production email dispatch not configured — falling back to logger.",
  );
  await sendDev(payload);
}

export const email = {
  async send(payload: EmailPayload): Promise<void> {
    if (env.isProd) {
      await sendProd(payload);
    } else {
      await sendDev(payload);
    }
  },
};
