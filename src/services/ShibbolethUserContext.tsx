'use client'
import { createContext, ReactNode,useContext } from "react";

import { ShibbolethUser } from "@/services/shibbolethAuth";

interface ShibbolethUserContextProps {
  user: ShibbolethUser | null;
}

const ShibbolethUserContext= createContext<ShibbolethUserContextProps| undefined>(undefined);

export const ShibbolethUserProvider = ({ children, user }: { children: ReactNode; user: ShibbolethUser | null }) => {
  return <ShibbolethUserContext.Provider value={{ user }}>{children}</ShibbolethUserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(ShibbolethUserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context.user;
};