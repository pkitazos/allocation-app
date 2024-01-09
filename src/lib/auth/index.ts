import { PrismaAdapter } from "@auth/prisma-adapter";
import { Role } from "@prisma/client";
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { db } from "../db";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (trigger === "signUp") {
        // check email
      }

      if (!dbUser) {
        if (user) {
          token.id = user?.id;
        }
        return token;
      }

      const userRole = await db.invitation.findFirst({
        where: { userEmail: dbUser.email! },
        select: { role: true },
      });

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        role: userRole?.role ?? "UNREGISTERED",
      };
    },

    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id as string,
        name: token.name,
        email: token.email,
        image: token.picture,
        role: token.role as Role,
      },
    }),
  },
});
