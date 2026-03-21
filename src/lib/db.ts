import "server-only";

import { MongoClient, Db, Collection } from "mongodb";
import type { Remix } from "@/types";

const DB_NAME = "doomportal";

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Please add MONGODB_URI to your .env.local");
  }
  return uri;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

/** Shared client instance (connect is lazy — first operation opens the pool). */
export function getMongoClient(): MongoClient {
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(getMongoUri());
  }
  return global._mongoClient;
}

/**
 * Synchronous DB handle for Better Auth adapter — avoids connecting during import/build.
 * First real DB operation will establish the connection.
 */
export function getDbSync(): Db {
  return getMongoClient().db(DB_NAME);
}

/**
 * Ensure the client is connected (for API routes that need a live connection).
 */
export async function getClient(): Promise<MongoClient> {
  const client = getMongoClient();
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  }
  return client.connect();
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db(DB_NAME);
}

export async function getRemixesCollection(): Promise<Collection<Remix>> {
  const db = await getDb();
  return db.collection<Remix>("remixes");
}
