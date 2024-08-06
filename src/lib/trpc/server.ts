import { headers } from "next/headers";
import { cache } from "react";

import { slim_auth } from "@/lib/auth/new-auth";

import { createCaller } from "@/server/root";
import { createTRPCContext } from "@/server/trpc";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    session: await slim_auth(), // TODO: replace with slimmed down auth function
    headers: heads,
  });
});

export const api = createCaller(createContext);
