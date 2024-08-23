"use client";
import { ForwardIcon } from "lucide-react";
import { unparse } from "papaparse";

import { useInstanceParams } from "@/components/params-context";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { api } from "@/lib/trpc/client";

import { ResultsCard } from "./results-card";

export function CheckSupervisorsSection() {
  const params = useInstanceParams();
  const {
    data,
    status,
    mutateAsync: checkSupervisorsAsync,
  } = api.institution.instance.external.checkSupervisors.useMutation();

  return (
    <div className="flex flex-col items-start gap-4">
      <p>
        Check if all supervisors exist on the new system. If not, please contact
        [person to contact]
      </p>
      <Button
        variant="secondary"
        className="flex items-center gap-2"
        onClick={() => checkSupervisorsAsync({ params })}
      >
        <ForwardIcon className="h-4 w-4" />
        <p>Check Supervisors</p>
      </Button>
      {status === "pending" && <Skeleton className="h-16 w-full" />}
      {status === "success" && (
        <ResultsCard
          userRole="supervisor"
          csvContent={unparse({
            fields: ["Supervisor GUID", "Exists in Assessment System"],
            data: data.checkedSupervisors.map((e) => [e.guid, e.exists]),
          })}
          data={data}
        />
      )}
    </div>
  );
}
