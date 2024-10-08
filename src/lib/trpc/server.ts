import { cache } from "react";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

import { createCaller } from "@/server/root";
import { createTRPCContext } from "@/server/trpc";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(headers());
  heads.set("x-trpc-source", "rsc");
  const user = await auth();
  return createTRPCContext({
    session: { user },
    headers: heads,
  });
});

export const api = createCaller(createContext);
