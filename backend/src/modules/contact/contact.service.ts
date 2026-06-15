import { email } from "@lib/email";
import { env } from "@config/env";
import type { ContactRequest } from "./contact.contracts";

export class ContactService {
  async submit(input: ContactRequest): Promise<void> {
    const subject = input.subject
      ? `[Contact] ${input.subject}`
      : "[Contact] New enquiry";

    const text = [
      `From: ${input.name} <${input.email}>`,
      ``,
      input.message,
    ].join("\n");

    await email.send({
      to: env.supportEmail,
      subject,
      text,
    });
  }
}
