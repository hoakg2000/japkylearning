import 'server-only';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { APIError } from 'better-auth/api';
import { nextCookies } from 'better-auth/next-js';
import { anonymous, twoFactor } from 'better-auth/plugins';
import { getDb, type Db } from '@/lib/db';
import { isOldEnough } from './age';
import { moveUserData } from './link';

function createAuth(db: Db) {
  return betterAuth({
    baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
    database: drizzleAdapter(db, { provider: 'pg' }),
    emailAndPassword: { enabled: true, minPasswordLength: 8 },
    user: {
      // Account deletion from /me (PDPL right to erasure); cascades to all learning data.
      deleteUser: { enabled: true },
      additionalFields: {
        role: { type: 'string', defaultValue: 'user', input: false },
        birthYear: { type: 'number', required: false },
      },
    },
    // Built-in limiter covers sign-in, sign-up and anonymous creation per IP.
    rateLimit: { enabled: true, window: 60, max: 30 },
    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            // Age gate (ADR 0011): registered accounts must be 16+. Anonymous guests carry no birth year.
            if (user.isAnonymous) return;
            if (!isOldEnough(user.birthYear as number | undefined)) {
              throw new APIError('BAD_REQUEST', { message: 'AGE_UNDER_16' });
            }
          },
        },
      },
    },
    plugins: [
      anonymous({
        onLinkAccount: async ({ anonymousUser, newUser }) => {
          await moveUserData(anonymousUser.user.id, newUser.user.id);
        },
      }),
      twoFactor({ issuer: 'Japky' }),
      nextCookies(),
    ],
  });
}

export type Auth = ReturnType<typeof createAuth>;
export type Session = Auth['$Infer']['Session'];

let instance: Promise<Auth> | undefined;

/** Built lazily so importing this module (e.g. during build) never opens the database. */
export function getAuth(): Promise<Auth> {
  return (instance ??= getDb().then(createAuth));
}
