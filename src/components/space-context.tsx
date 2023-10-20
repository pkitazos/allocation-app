"use client";
import { ReactNode, createContext, useContext, useState } from "react";

export const SpaceContext = createContext({
  selectedIndex: -1,
  update: (() => {
    throw new Error("space context required");
  }) as (_: number) => void,
});

export function SpaceContextProvider({ children }: { children: ReactNode }) {
  const [selectedSpace, setSelectedSpace] = useState(-1);

  return (
    <SpaceContext.Provider
      value={{ selectedIndex: selectedSpace, update: setSelectedSpace }}
    >
      {children}
    </SpaceContext.Provider>
  );
}

export const useSpaceContext = () => {
  return useContext(SpaceContext);
};
