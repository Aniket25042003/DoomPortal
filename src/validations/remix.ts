import { z } from "zod";

export const createRemixSchema = z.object({
  handle: z
    .string()
    .min(1, "Handle is required")
    .max(100, "Handle is too long")
    .transform((h) => h.replace(/^@/, "").trim()),
  platform: z.enum(["x", "instagram"]),
  sinId: z.string().min(1, "Please select a social sin"),
});

export const viewRemixSchema = z.object({
  shortId: z.string().min(1, "Invalid remix ID"),
});

export type CreateRemixInput = z.infer<typeof createRemixSchema>;
export type ViewRemixInput = z.infer<typeof viewRemixSchema>;
