"use client";
import { useState } from "react";

import { useInstanceParams } from "@/components/params-context";
import DataTable from "@/components/ui/data-table/data-table";
import { Skeleton } from "@/components/ui/skeleton";

import { api } from "@/lib/trpc/client";

import { useAlgorithmResultColumns } from "./algorithm-result-columns";

export function AlgorithmResultDataTable({
  selectedAlg,
}: {
  selectedAlg: string | undefined;
}) {
  const params = useInstanceParams();
  const [selectedAlgName, setSelectedAlgName] = useState<string | undefined>(
    selectedAlg,
  );

  const { status, data } =
    api.institution.instance.algorithm.getAllSummaryResults.useQuery({
      params,
    });

  const columns = useAlgorithmResultColumns({
    selectedAlgName,
    setSelectedAlgName,
  });

  if (status !== "success") return <Skeleton className="h-60 w-full" />;

  return <DataTable columns={columns} data={data} />;
}
