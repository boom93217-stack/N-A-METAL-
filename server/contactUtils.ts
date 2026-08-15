import { z } from "zod";

/** Validates and trims public contact-form input before it is persisted. */
export const contactMessageSchema = z.object({
  name: z.string().trim().min(2).max(180),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().min(5).max(48),
  message: z.string().trim().min(10).max(5000),
});
