import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt, { compare } from "bcryptjs";

import { db } from "@/server/db";
import GitHubProvider from "next-auth/providers/github";
import { env } from "@/env";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  session: { strategy: "jwt" },
  providers: [
    GitHubProvider({
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "myemail@myemail.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "*********",
        },
      },

      async authorize(credentials, req) {
        // Search for user in database
        const userFound = await db.user.findUnique({
          where: { email: credentials.email as string },
          select: {
            name: true,
            email: true,
            password: true,
            image: true,
            id: true,
          },
        });

        if (!userFound) throw new Error("Your email or password is incorrect");

        const passwordMatch = await bcrypt.compare(
          credentials!.password as string,
          userFound.password as string,
        );

        if (!passwordMatch)
          throw new Error("Your email or password is incorrect");

        return {
          id: userFound.id,
          name: userFound.name,
          email: userFound.email,
          // Add any other properties you need in the session
        };
      },
    }),
  ],
  adapter: PrismaAdapter(db),
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
} satisfies NextAuthConfig;
