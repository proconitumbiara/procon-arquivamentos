import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession } from "better-auth/plugins";

import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.usersTable,
      session: schema.sessionsTable,
      account: schema.accountsTable,
      verification: schema.verificationsTable,
    },
  }),
  trustedOrigins: ["http://localhost:3000", "http://192.168.1.12:3000"],
  plugins: [
    customSession(async ({ user, session }) => {
      return {
        user: {
          ...user,
        },
        session,
      };
    }),
  ],
  emailAndPassword: {
    enabled: true,
  },
});
