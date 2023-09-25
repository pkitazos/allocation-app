"use client";
import { useUser } from "@clerk/nextjs";
import { ReactNode, createContext, useContext } from "react";

interface ClearanceContext {
  userClearance: number;
  recompute: () => void;
}

const clearanceContext = createContext<ClearanceContext>({
  userClearance: 0,
  recompute: () => {},
});

export function ClearanceProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();

  let userClearance = user?.publicMetadata.clearance as number;

  console.log({ userClearance });

  const recompute = () => {
    user?.reload();
  };

  return (
    <clearanceContext.Provider value={{ userClearance, recompute }}>
      {children}
    </clearanceContext.Provider>
  );
}

export function useClearance() {
  const { userClearance, recompute } = useContext(clearanceContext);
  return [userClearance, recompute] as const;
}
