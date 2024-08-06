"use client";
import { createContext, ReactNode } from "react";

import { NewSession } from "@/lib/auth/new-auth";

const SessionContext = createContext<NewSession | null>(null);

export function SessionProvider({
  children,
  session,
}: {
  children: ReactNode;
  session: NewSession | null;
}) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}
