"use client";
import { InstanceParams } from "@/lib/validations/params";
import { ReactNode, createContext, useContext } from "react";

const InstanceParamsContext = createContext<InstanceParams | undefined>(
  undefined,
);

export function InstanceParamsProvider({
  children,
  params,
}: {
  children: ReactNode;
  params: InstanceParams;
}) {
  return (
    <InstanceParamsContext.Provider value={params}>
      {children}
    </InstanceParamsContext.Provider>
  );
}

export function useInstanceParams() {
  const params = useContext(InstanceParamsContext);
  if (!params) throw new Error("Missing InstanceParamsProvider in the tree");
  return params;
}