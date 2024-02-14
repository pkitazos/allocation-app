import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";

import { db } from "@/lib/db";
import authConfig from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, trigger }) {
      const dbUser = await db.user.findFirst({
        where: { email: token.email },
      });

      if (trigger === "signUp") {
        const invite = await db.invitation.findFirst({
          where: { email: user.email ?? "" },
        });

        if (!invite) {
          throw new Error("You haven't been invited to the platform");
        }
      }

      if (!dbUser) {
        if (user) {
          token.id = user?.id;
        }
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
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
      },
    }),
  },
});
