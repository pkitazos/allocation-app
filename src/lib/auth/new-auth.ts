import { Session } from "next-auth/types";

export declare function slim_auth(): Promise<Session | null>;
// TODO: implement function to get session
// can potentially get this from JWT or cookies?
