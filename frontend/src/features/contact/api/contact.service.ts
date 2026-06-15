import { http } from "@shared/lib/transport";
import type { ContactRequest } from "../contracts/contact.contract";

export const contactService = {
  async submit(payload: ContactRequest): Promise<void> {
    await http.request({
      method: "POST",
      url: "/contact",
      data: payload,
    });
  },
};

export type ContactService = typeof contactService;
