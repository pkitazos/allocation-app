"use client";
import { Session } from "@/lib/validations/auth";
import { setCookies } from "@/lib/auth/auth2";
import { createContext, ReactNode } from "react";

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  if (session?.user) setCookies(session?.user);

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}
