"use client";
import { createContext, ReactNode, useContext } from "react";
import { Flag, Tag } from "@prisma/client";

const DataTableCtx = createContext<Details | undefined>(undefined);

type Details = {
  flags: Pick<Flag, "id" | "title">[];
  tags: Pick<Tag, "id" | "title">[];
};

export function DataTableProvider({
  children,
  details,
}: {
  children: ReactNode;
  details: Details;
}) {
  return (
    <DataTableCtx.Provider value={details}>{children}</DataTableCtx.Provider>
  );
}

export function useDataTableFlags() {
  const details = useContext(DataTableCtx);
  if (!details) throw new Error("Missing DataTableProvider in the tree");
  return details.flags;
}
export function useDataTableTags() {
  const details = useContext(DataTableCtx);
  if (!details) throw new Error("Missing DataTableProvider in the tree");
  return details.tags;
}
