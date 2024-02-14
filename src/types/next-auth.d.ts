import { JWT as DefaultJWT } from "@auth/core/jwt";
import { DefaultSession } from "next-auth";

declare module "@auth/core/types" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
  }
}

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
    };
  }

  interface JWT extends DefaultJWT {
    id: string;
  }
}
