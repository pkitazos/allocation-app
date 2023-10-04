import { Role } from "@prisma/client";
import NextAuth, { DefaultSession, User } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      role: Role | undefined | null;
    } & DefaultSession["user"];
  }
}

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation
declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
    role: string;
  }
}
