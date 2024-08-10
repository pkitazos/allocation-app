"use client";
import { createContext, ReactNode, useContext } from "react";
import { Stage } from "@prisma/client";

import { formatParamsAsPath } from "@/lib/utils/general/get-instance-path";
import { InstanceParams } from "@/lib/validations/params";
import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";

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

export function InstanceHomeRedirectButton() {
  const instancePath = useInstancePath();
  return (
    <Link
      href={instancePath}
      className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      prefetch={false}
    >
      <ArrowUpLeft className="h-4 w-4" />
      <span>Go to Instance Home</span>
    </Link>
  );
}
