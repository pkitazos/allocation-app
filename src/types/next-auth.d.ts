import { Role } from "@prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "@auth/core/jwt";

declare module "@auth/core/types" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: Role | undefined | null;
    };
  }

  interface User extends DefaultUser {
    role: Role | undefined | null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: Role | undefined | null;
  }
}

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: Role | undefined | null;
    };
  }

  interface User extends DefaultUser {
    role: Role | undefined | null;
  }

  interface JWT extends DefaultJWT {
    id: string;
    role: Role | undefined | null;
  }
}
