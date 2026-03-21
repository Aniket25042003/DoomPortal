import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { getDbSync, getMongoClient } from "./db";

const client = getMongoClient();
const db = getDbSync();

const baseUrl = process.env.BETTER_AUTH_URL;

export const auth = betterAuth({
  baseURL: baseUrl,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    "https://doomportal.vercel.app",
    "http://localhost:3000",
    baseUrl,
  ].filter((origin): origin is string => Boolean(origin)),
  database: mongodbAdapter(db, { client }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      prompt: "select_account",
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  plugins: [nextCookies()],
});
