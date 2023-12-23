import { Role } from "@prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";

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

  interface User extends DefaultUser {
    role: Role | undefined | null;
  }
}

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation
declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
    role: Role;
  }
}
