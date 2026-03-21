import "server-only";

import { customAlphabet } from "nanoid";
import { getRemixesCollection } from "./db";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";
const generateId = customAlphabet(ALPHABET, 8);

/** Server-only: generates a unique shortId for remix URLs. */
export async function generateShortId(): Promise<string> {
  const maxAttempts = 5;
  for (let i = 0; i < maxAttempts; i++) {
    const id = generateId();
    const collection = await getRemixesCollection();
    const existing = await collection.findOne({ shortId: id });
    if (!existing) return id;
  }
  throw new Error("Failed to generate unique short ID");
}
