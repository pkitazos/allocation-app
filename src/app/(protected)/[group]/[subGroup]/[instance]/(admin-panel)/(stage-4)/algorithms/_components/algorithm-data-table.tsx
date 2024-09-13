"use client";

import { useInstanceParams } from "@/components/params-context";
import DataTable from "@/components/ui/data-table/data-table";
import { Skeleton } from "@/components/ui/skeleton";

import { api } from "@/lib/trpc/client";

import { useAlgorithmColumns } from "./algorithm-columns";
import { NewAlgorithmSection } from "./new-algorithm-section";

export function AlgorithmSection({ takenNames }: { takenNames: string[] }) {
  const params = useInstanceParams();
  const { status, data } = api.institution.instance.algorithm.getAll.useQuery({
    params,
  });

  const columns = useAlgorithmColumns();

  if (status !== "success") return <Skeleton className="h-60 w-full" />;

  // TODO: fix type error
  return (
    <>
      {/* @ts-expect-error works fine */}
      <DataTable columns={columns} data={data} />
      <NewAlgorithmSection takenNames={takenNames} />
    </>
  );
}
