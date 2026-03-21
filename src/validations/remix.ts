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

export const completeRemixSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  downloadUrl: z.string().url("Invalid download URL"),
  handle: z.string().min(1),
  platform: z.enum(["x", "instagram"]),
  sinId: z.string().min(1),
  profileImageUrl: z.string().url("Invalid profile image URL"),
});

export const viewRemixSchema = z.object({
  shortId: z.string().min(1, "Invalid remix ID"),
});

export type CreateRemixInput = z.infer<typeof createRemixSchema>;
export type CompleteRemixInput = z.infer<typeof completeRemixSchema>;
export type ViewRemixInput = z.infer<typeof viewRemixSchema>;
