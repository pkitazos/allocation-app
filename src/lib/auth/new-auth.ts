import { NewUser } from "@prisma/client";

type NewSession = {
  id: string;
  sessionToken: string;
  userId: string;
  expires: number;
  user: NewUser;
};

export declare function slim_auth(): Promise<NewSession | null>;
// TODO: implement function to get session
// can potentially get this from JWT or cookies?
