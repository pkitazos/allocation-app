"use client";
import { ReactNode, createContext, useContext, useState } from "react";

interface ClearanceContext {
  userClearance: number;
  recompute: () => void;
}

const clearanceContext = createContext<ClearanceContext>({
  userClearance: 0,
  recompute: () => {},
});

export function ClearanceProvider({ children }: { children: ReactNode }) {
  const [userClearance, setUserClearance] = useState(0);

  const recompute = () => {
    setUserClearance(0);
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
