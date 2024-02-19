"use client";
import { createContext, ReactNode, useContext } from "react";
import { Stage } from "@prisma/client";

import { formatParamsAsPath } from "@/lib/utils/general/get-instance-path";
import { InstanceParams } from "@/lib/validations/params";

const InstanceContext = createContext<Instance | undefined>(undefined);

type Instance = { params: InstanceParams; stage: Stage };

export function InstanceParamsProvider({
  children,
  params,
}: {
  children: ReactNode;
  params: Instance;
}) {
  return (
    <InstanceContext.Provider value={params}>
      {children}
    </InstanceContext.Provider>
  );
}

export function useInstanceParams() {
  const instance = useContext(InstanceContext);
  if (!instance) throw new Error("Missing InstanceParamsProvider in the tree");
  return instance.params;
}

export function useInstancePath() {
  const instance = useContext(InstanceContext);
  if (!instance) throw new Error("Missing InstanceParamsProvider in the tree");
  return formatParamsAsPath(instance.params);
}

export function useInstanceStage() {
  const instance = useContext(InstanceContext);
  if (!instance) throw new Error("Missing InstanceParamsProvider in the tree");
  return instance.stage;
}
