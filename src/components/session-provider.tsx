"use client";
import { NewSession } from "@/lib/validations/auth";
import { createContext, ReactNode } from "react";

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
